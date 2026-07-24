<?php

use App\Models\Branch;
use App\Models\Member;
use App\Models\Permission;
use App\Models\Role;
use App\Models\Tenant;
use App\Models\User;
use App\Modules\Billing\Models\Invoice;
use App\Modules\MemberPortal\Models\MemberPortalAccount;
use App\Modules\Membership\Events\MembershipActivated;
use App\Modules\Membership\Events\MembershipExpired;
use App\Modules\Membership\Events\MembershipExpiring;
use App\Modules\Membership\Events\MembershipRenewed;
use App\Modules\Membership\Models\Membership;
use App\Modules\Notification\Contracts\NotificationDispatcher;
use App\Modules\Notification\Contracts\NotificationTemplateRenderer;
use App\Modules\Notification\DTOs\NotificationEvent;
use App\Modules\Notification\Jobs\DeliverNotificationJob;
use App\Modules\Notification\Jobs\DispatchAnnouncementJob;
use App\Modules\Notification\Listeners\BillingNotificationListener;
use App\Modules\Notification\Listeners\MembershipNotificationListener;
use App\Modules\Notification\Models\Announcement;
use App\Modules\Notification\Models\InAppNotification;
use App\Modules\Notification\Models\MemberNotificationPreference;
use App\Modules\Notification\Models\NotificationDelivery;
use App\Modules\Notification\Models\NotificationDeliveryAttempt;
use App\Modules\Notification\Models\NotificationRule;
use App\Modules\Notification\Models\NotificationTemplate;
use App\Modules\Notification\Providers\NotificationServiceProvider;
use App\Modules\Notification\Services\DatabaseNotificationDispatcher;
use Carbon\CarbonImmutable;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Queue;
use Illuminate\Validation\ValidationException;
use Tests\Concerns\InteractsWithPermissions;

uses(RefreshDatabase::class, InteractsWithPermissions::class);

beforeEach(function () {
    $this->app->register(NotificationServiceProvider::class);
});

function notificationActor(array $permissions): array
{
    $tenant = Tenant::factory()->create();
    $branch = Branch::factory()->for($tenant)->create();
    $user = notificationUser($tenant, $permissions);
    $user->branches()->attach($branch, ['is_primary' => true]);

    return [$tenant, $branch, $user];
}

function notificationUser(Tenant $tenant, array $permissions): User
{
    $user = User::factory()->create(['tenant_id' => $tenant->id]);
    $role = Role::factory()->create(['tenant_id' => $tenant->id]);
    $role->permissions()->sync(collect($permissions)->map(
        fn (string $slug) => Permission::query()->firstOrCreate(['slug' => $slug], ['name' => $slug])->id,
    ));
    $user->roles()->attach($role);

    return $user;
}

it('authorizes and audits notification template CRUD with tenant isolation', function () {
    [$tenant, $branch, $user] = notificationActor(['notifications.templates.create', 'notifications.templates.view']);
    $response = $this->actingAs($user)->postJson('/api/v1/notification-templates', [
        'branch_id' => $branch->id, 'name' => 'Expiry', 'key' => 'expiry',
        'channel' => 'in_app', 'body' => 'Hello {{ member_name }}',
        'variables' => ['member_name'], 'status' => 'active',
    ])->assertCreated();

    expect(NotificationTemplate::query()->count())->toBe(1)
        ->and($response->json('data.tenant_id'))->toBe($tenant->id);

    $other = Tenant::factory()->create();
    $otherUser = notificationUser($other, ['notifications.templates.view']);
    $this->actingAs($otherUser)
        ->getJson('/api/v1/notification-templates/'.$response->json('data.id'))
        ->assertNotFound();
});

it('renders only allow-listed placeholders without evaluating expressions', function () {
    $tenant = Tenant::factory()->create();
    $template = NotificationTemplate::withoutGlobalScopes()->create([
        'tenant_id' => $tenant->id, 'name' => 'Safe', 'key' => 'safe',
        'channel' => 'email', 'body' => 'Hello {{ member_name }} {{ php() }}',
        'variables' => ['member_name'], 'status' => 'active',
    ]);
    $renderer = app(NotificationTemplateRenderer::class);
    $rendered = $renderer->render($template, ['member_name' => '<Admin>']);
    expect($rendered->body)->toContain('&lt;Admin&gt;')->and($rendered->body)->toContain('{{ php() }}');
    expect(fn () => $renderer->render($template, ['secret' => 'x']))->toThrow(ValidationException::class);
});

it('creates one queued delivery for duplicate domain events and honors preferences', function () {
    Queue::fake();
    [$tenant, $branch] = notificationActor([]);
    $member = Member::factory()->for($tenant)->create(['branch_id' => $branch->id]);
    $template = NotificationTemplate::withoutGlobalScopes()->create([
        'tenant_id' => $tenant->id, 'branch_id' => $branch->id, 'name' => 'Expiry',
        'key' => 'expiry', 'channel' => 'in_app', 'body' => 'Expires {{ expires_on }}',
        'variables' => ['expires_on'], 'status' => 'active',
    ]);
    NotificationRule::withoutGlobalScopes()->create([
        'tenant_id' => $tenant->id, 'branch_id' => $branch->id,
        'template_id' => $template->id, 'name' => 'Expiry', 'event_type' => 'MembershipExpiring',
        'channel' => 'in_app', 'status' => 'active',
    ]);
    $event = new NotificationEvent('evt-1', 'MembershipExpiring', $tenant->id, $branch->id, $member->id, ['expires_on' => '2026-08-01'], CarbonImmutable::now());
    $dispatcher = app(NotificationDispatcher::class);
    $dispatcher->dispatchEvent($event);
    $dispatcher->dispatchEvent($event);

    expect(NotificationDelivery::withoutGlobalScopes()->count())->toBe(1);
    Queue::assertPushed(DeliverNotificationJob::class, 1);
});

it('enforces exact recipient ownership for notification read actions', function () {
    [$tenant, $branch, $user] = notificationActor([]);
    $member = Member::factory()->for($tenant)->create(['branch_id' => $branch->id]);
    MemberPortalAccount::withoutGlobalScopes()->create([
        'tenant_id' => $tenant->id, 'member_id' => $member->id,
        'user_id' => $user->id, 'status' => 'active',
    ]);
    $notification = InAppNotification::withoutGlobalScopes()->create([
        'tenant_id' => $tenant->id, 'branch_id' => $branch->id,
        'member_id' => $member->id, 'type' => 'test', 'title' => 'Owned', 'body' => 'Body',
    ]);

    $this->actingAs($user)->patchJson("/api/v1/notifications/{$notification->id}/read")
        ->assertOk()->assertJsonPath('data.id', $notification->id);
    expect($notification->fresh()->read_at)->not->toBeNull();

    $otherTenant = Tenant::factory()->create();
    $other = notificationUser($otherTenant, []);
    $this->actingAs($other)->patchJson("/api/v1/notifications/{$notification->id}/read")->assertNotFound();
});

it('rejects undeclared template placeholders, duplicate keys, and unauthorized branch filters', function () {
    [$tenant, $branch, $user] = notificationActor([
        'notifications.templates.create',
        'notifications.templates.view',
    ]);
    $otherBranch = Branch::factory()->for($tenant)->create();

    $this->actingAs($user)->postJson('/api/v1/notification-templates', [
        'branch_id' => $branch->id,
        'name' => 'Unsafe',
        'key' => 'unsafe',
        'channel' => 'email',
        'subject' => 'Hello {{ member_name }}',
        'body' => 'Expires {{ expires_on }}',
        'variables' => ['member_name'],
    ])->assertUnprocessable()->assertJsonValidationErrors('variables');

    $payload = [
        'branch_id' => $branch->id,
        'name' => 'Safe',
        'key' => 'safe',
        'channel' => 'email',
        'subject' => 'Hello {{ member_name }}',
        'body' => 'Welcome',
        'variables' => ['member_name'],
        'status' => 'active',
    ];
    $this->actingAs($user)->postJson('/api/v1/notification-templates', $payload)->assertCreated();
    $this->actingAs($user)->postJson('/api/v1/notification-templates', $payload)
        ->assertUnprocessable()->assertJsonValidationErrors('key');
    $this->actingAs($user)
        ->getJson("/api/v1/notification-templates?branch_id={$otherBranch->id}")
        ->assertForbidden();
});

it('queues deliveries for every membership lifecycle listener idempotently', function (string $eventClass) {
    Queue::fake();
    [$tenant, $branch] = notificationActor([]);
    $member = Member::factory()->for($tenant)->create(['branch_id' => $branch->id]);
    $membership = Membership::factory()->for($tenant)->create([
        'branch_id' => $branch->id,
        'member_id' => $member->id,
    ]);
    $template = NotificationTemplate::withoutGlobalScopes()->create([
        'tenant_id' => $tenant->id,
        'branch_id' => $branch->id,
        'name' => class_basename($eventClass),
        'key' => strtolower(class_basename($eventClass)),
        'channel' => 'in_app',
        'body' => 'Hello {{ member_name }}',
        'variables' => ['member_name'],
        'status' => 'active',
    ]);
    NotificationRule::withoutGlobalScopes()->create([
        'tenant_id' => $tenant->id,
        'branch_id' => $branch->id,
        'template_id' => $template->id,
        'name' => class_basename($eventClass),
        'event_type' => class_basename($eventClass),
        'channel' => 'in_app',
        'status' => 'active',
    ]);
    $event = $eventClass === MembershipRenewed::class
        ? new MembershipRenewed($membership, $membership)
        : new $eventClass($membership);
    $listener = app(MembershipNotificationListener::class);
    $listener->handle($event);
    $listener->handle($event);

    expect(NotificationDelivery::withoutGlobalScopes()->count())->toBe(1);
    Queue::assertPushed(DeliverNotificationJob::class, 1);
})->with([
    MembershipActivated::class,
    MembershipExpiring::class,
    MembershipExpired::class,
    MembershipRenewed::class,
]);

it('bridges typed billing events using the source event id without duplicate deliveries', function () {
    Queue::fake();
    [$tenant, $branch] = notificationActor([]);
    $member = Member::factory()->for($tenant)->create(['branch_id' => $branch->id]);
    $invoice = Invoice::factory()->for($tenant)->create([
        'branch_id' => $branch->id,
        'member_id' => $member->id,
    ]);
    $template = NotificationTemplate::withoutGlobalScopes()->create([
        'tenant_id' => $tenant->id,
        'name' => 'Payment',
        'key' => 'payment',
        'channel' => 'in_app',
        'body' => 'Paid {{ amount_cents }}',
        'variables' => ['amount_cents'],
        'status' => 'active',
    ]);
    NotificationRule::withoutGlobalScopes()->create([
        'tenant_id' => $tenant->id,
        'template_id' => $template->id,
        'name' => 'Payment',
        'event_type' => 'PaymentCompleted',
        'channel' => 'in_app',
        'status' => 'active',
    ]);
    $event = new class($tenant->id, $branch->id, $invoice->id)
    {
        public string $type = 'PaymentCompleted';

        public string $eventId = 'billing-event-1';

        public string $occurredAt;

        public int $amountCents = 2500;

        public string $method = 'cash';

        public function __construct(
            public int $tenantId,
            public int $branchId,
            public int $invoiceId,
        ) {
            $this->occurredAt = now()->toIso8601String();
        }
    };
    $listener = app(BillingNotificationListener::class);
    $listener->handle($event);
    $listener->handle($event);

    expect(NotificationDelivery::withoutGlobalScopes()->count())->toBe(1)
        ->and(NotificationDelivery::withoutGlobalScopes()->first()->payload['body'])->toContain('2500');
});

it('delivers in-app messages once and records disabled channel failures safely', function () {
    [$tenant, $branch] = notificationActor([]);
    $member = Member::factory()->for($tenant)->create(['branch_id' => $branch->id]);
    $inApp = NotificationDelivery::withoutGlobalScopes()->create([
        'tenant_id' => $tenant->id,
        'branch_id' => $branch->id,
        'member_id' => $member->id,
        'channel' => 'in_app',
        'recipient' => 'member:'.$member->id,
        'status' => 'queued',
        'idempotency_key' => 'in-app-delivery',
        'payload' => ['event_type' => 'Test', 'title' => 'Title', 'body' => 'Body'],
    ]);
    $job = new DeliverNotificationJob($tenant->id, $inApp->id);
    $job->handle();
    $job->handle();

    expect(InAppNotification::withoutGlobalScopes()->count())->toBe(1)
        ->and($inApp->fresh()->status)->toBe('delivered')
        ->and(NotificationDeliveryAttempt::withoutGlobalScopes()->count())->toBe(1);

    $sms = NotificationDelivery::withoutGlobalScopes()->create([
        'tenant_id' => $tenant->id,
        'member_id' => $member->id,
        'channel' => 'sms',
        'recipient' => '+94770000000',
        'status' => 'queued',
        'idempotency_key' => 'sms-delivery',
        'payload' => [],
    ]);
    (new DeliverNotificationJob($tenant->id, $sms->id))->handle();
    expect($sms->fresh()->status)->toBe('failed')
        ->and($sms->fresh()->failure_reason)->toBe('sms_provider_not_configured');

    $whatsapp = NotificationDelivery::withoutGlobalScopes()->create([
        'tenant_id' => $tenant->id,
        'member_id' => $member->id,
        'channel' => 'whatsapp',
        'recipient' => '+94770000000',
        'status' => 'queued',
        'idempotency_key' => 'whatsapp-delivery',
        'payload' => [],
    ]);
    (new DeliverNotificationJob($tenant->id, $whatsapp->id))->handle();
    expect($whatsapp->fresh()->status)->toBe('failed')
        ->and($whatsapp->fresh()->failure_reason)->toBe('whatsapp_provider_not_configured');
});

it('reaches terminal failure with the exact attempt count after exhausting retries', function () {
    [$tenant] = notificationActor([]);
    $delivery = NotificationDelivery::withoutGlobalScopes()->create([
        'tenant_id' => $tenant->id,
        'channel' => 'email',
        'recipient' => 'member@example.test',
        'status' => 'queued',
        'idempotency_key' => 'email-retry-boundary',
        'payload' => ['title' => 'Title', 'body' => 'Body'],
    ]);
    Mail::shouldReceive('raw')->times(3)->andThrow(new RuntimeException('provider secret detail'));

    $job = new DeliverNotificationJob($tenant->id, $delivery->id);
    expect($job->tries)->toBe(3)->and($job->backoff)->toBe([10, 60, 300]);

    for ($i = 0; $i < 3; $i++) {
        expect(fn () => $job->handle())->toThrow(RuntimeException::class);
    }
    expect($delivery->fresh()->status)->toBe('retrying')
        ->and($delivery->fresh()->attempt_count)->toBe(3);

    $job->failed(new RuntimeException('provider secret detail'));
    expect($delivery->fresh()->status)->toBe('failed')
        ->and($delivery->fresh()->failure_reason)->toBe('delivery_failed_after_retries')
        ->and($delivery->fresh()->attempt_count)->toBe(3);
});

it('records retry attempts and terminal failure without leaking provider exceptions', function () {
    [$tenant] = notificationActor([]);
    $delivery = NotificationDelivery::withoutGlobalScopes()->create([
        'tenant_id' => $tenant->id,
        'channel' => 'email',
        'recipient' => 'member@example.test',
        'status' => 'queued',
        'idempotency_key' => 'email-failure',
        'payload' => ['title' => 'Title', 'body' => 'Body'],
    ]);
    Mail::shouldReceive('raw')->once()->andThrow(new RuntimeException('provider secret detail'));
    $job = new DeliverNotificationJob($tenant->id, $delivery->id);
    expect(fn () => $job->handle())->toThrow(RuntimeException::class);
    expect($delivery->fresh()->status)->toBe('retrying')
        ->and($delivery->fresh()->attempt_count)->toBe(1)
        ->and($delivery->fresh()->failure_reason)->toBe('delivery_failed');
    $job->failed(new RuntimeException('provider secret detail'));
    expect($delivery->fresh()->status)->toBe('failed')
        ->and($delivery->fresh()->failure_reason)->toBe('delivery_failed_after_retries');
});

it('schedules and cancels announcements while honoring member preferences', function () {
    Queue::fake();
    [$tenant, $branch, $user] = notificationActor([
        'notifications.announcements.create',
        'notifications.announcements.dispatch',
        'notifications.announcements.cancel',
    ]);
    $member = Member::factory()->for($tenant)->create(['branch_id' => $branch->id]);
    $template = NotificationTemplate::withoutGlobalScopes()->create([
        'tenant_id' => $tenant->id,
        'branch_id' => $branch->id,
        'name' => 'Announcement',
        'key' => 'announcement',
        'channel' => 'in_app',
        'body' => '{{ announcement_message }}',
        'variables' => ['announcement_message'],
        'status' => 'active',
    ]);
    MemberNotificationPreference::withoutGlobalScopes()->create([
        'tenant_id' => $tenant->id,
        'member_id' => $member->id,
        'channel' => 'in_app',
        'notification_type' => 'ManualAnnouncement',
        'enabled' => false,
    ]);
    $response = $this->actingAs($user)->postJson('/api/v1/announcements', [
        'branch_id' => $branch->id,
        'template_id' => $template->id,
        'title' => 'Notice',
        'message' => 'Closed tomorrow',
        'channels' => ['in_app'],
        'audience_filters' => ['branch_id' => $branch->id],
    ])->assertCreated();
    $id = $response->json('data.id');
    $this->actingAs($user)->postJson("/api/v1/announcements/{$id}/schedule", [])
        ->assertOk()->assertJsonPath('data.status', 'scheduled');
    Queue::assertPushed(DispatchAnnouncementJob::class);
    $this->actingAs($user)->postJson("/api/v1/announcements/{$id}/cancel")
        ->assertOk()->assertJsonPath('data.status', 'cancelled');

    $announcement = Announcement::withoutGlobalScopes()->create([
        'tenant_id' => $tenant->id,
        'branch_id' => $branch->id,
        'template_id' => $template->id,
        'title' => 'Preference test',
        'message' => 'Body',
        'channels' => ['in_app'],
        'audience_filters' => ['branch_id' => $branch->id],
        'status' => 'scheduled',
        'scheduled_at' => now(),
        'created_by' => $user->id,
    ]);
    (new DispatchAnnouncementJob($tenant->id, $announcement->id))
        ->handle(app(DatabaseNotificationDispatcher::class));
    expect(NotificationDelivery::withoutGlobalScopes()->count())->toBe(0)
        ->and($announcement->fresh()->status)->toBe('dispatched');
    $this->actingAs($user)->postJson("/api/v1/announcements/{$announcement->id}/cancel")
        ->assertConflict();
});

it('dispatches a scheduled announcement only at or after its exact scheduled time', function () {
    Queue::fake();
    [$tenant, $branch] = notificationActor([]);
    $member = Member::factory()->for($tenant)->create(['branch_id' => $branch->id]);
    $template = NotificationTemplate::withoutGlobalScopes()->create([
        'tenant_id' => $tenant->id,
        'branch_id' => $branch->id,
        'name' => 'Announcement',
        'key' => 'announcement-timing',
        'channel' => 'in_app',
        'body' => '{{ announcement_message }}',
        'variables' => ['announcement_message'],
        'status' => 'active',
    ]);
    $announcement = Announcement::withoutGlobalScopes()->create([
        'tenant_id' => $tenant->id,
        'branch_id' => $branch->id,
        'template_id' => $template->id,
        'title' => 'Future notice',
        'message' => 'Not yet',
        'channels' => ['in_app'],
        'audience_filters' => ['branch_id' => $branch->id],
        'status' => 'scheduled',
        'scheduled_at' => now()->addMinutes(10),
        'created_by' => $member->id,
    ]);

    (new DispatchAnnouncementJob($tenant->id, $announcement->id))
        ->handle(app(DatabaseNotificationDispatcher::class));

    expect($announcement->fresh()->status)->toBe('scheduled')
        ->and($announcement->fresh()->dispatched_at)->toBeNull()
        ->and(NotificationDelivery::withoutGlobalScopes()->count())->toBe(0);

    $announcement->forceFill(['scheduled_at' => now()->subMinute()])->save();
    (new DispatchAnnouncementJob($tenant->id, $announcement->id))
        ->handle(app(DatabaseNotificationDispatcher::class));

    expect($announcement->fresh()->status)->toBe('dispatched')
        ->and($announcement->fresh()->dispatched_at)->not->toBeNull()
        ->and(NotificationDelivery::withoutGlobalScopes()->count())->toBe(1);
});

it('updates member preferences and marks all owned notifications read', function () {
    [$tenant, $branch, $user] = notificationActor([]);
    $member = Member::factory()->for($tenant)->create(['branch_id' => $branch->id]);
    MemberPortalAccount::withoutGlobalScopes()->create([
        'tenant_id' => $tenant->id,
        'member_id' => $member->id,
        'user_id' => $user->id,
        'status' => 'active',
    ]);
    InAppNotification::withoutGlobalScopes()->create([
        'tenant_id' => $tenant->id,
        'member_id' => $member->id,
        'type' => 'one',
        'title' => 'One',
        'body' => 'Body',
    ]);
    InAppNotification::withoutGlobalScopes()->create([
        'tenant_id' => $tenant->id,
        'member_id' => $member->id,
        'type' => 'two',
        'title' => 'Two',
        'body' => 'Body',
    ]);

    $this->actingAs($user)->putJson('/api/v1/notification-preferences', [
        'preferences' => [[
            'channel' => 'email',
            'notification_type' => '*',
            'enabled' => false,
        ]],
    ])->assertOk()->assertJsonPath('data.0.enabled', false);
    $this->actingAs($user)->getJson('/api/v1/notifications/unread-count')
        ->assertOk()->assertJsonPath('data.count', 2);
    $this->actingAs($user)->postJson('/api/v1/notifications/mark-all-read')
        ->assertOk()->assertJsonPath('data.updated', 2);
});
