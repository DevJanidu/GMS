<?php

use App\Models\Branch;
use App\Models\Tenant;
use App\Modules\AccessControl\Models\AuditLog;
use App\Modules\AccessControl\Services\AuditLogger;
use App\Modules\Audit\Jobs\GenerateAuditExportJob;
use App\Modules\Report\Models\ReportExport;
use App\Modules\Report\Providers\ReportServiceProvider;
use Carbon\CarbonImmutable;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Tests\Concerns\InteractsWithPermissions;

beforeEach(function () {
    $this->app->register(ReportServiceProvider::class);
});

uses(RefreshDatabase::class, InteractsWithPermissions::class);

it('redacts sensitive values before persistence and prevents mutation', function () {
    $tenant = Tenant::factory()->create();
    $branch = Branch::factory()->for($tenant)->create();
    $actor = $this->ownerUser($tenant);
    $log = app(AuditLogger::class)->log(
        $actor,
        'security.changed',
        $actor,
        ['password' => 'secret', 'nested' => ['api_key' => 'key', 'safe' => 'yes']],
        branchId: $branch->id,
    );

    expect($log->changes['password'])->toBe('[REDACTED]')
        ->and($log->changes['nested']['api_key'])->toBe('[REDACTED]')
        ->and($log->changes['nested']['safe'])->toBe('yes')
        ->and(fn () => $log->update(['action' => 'tampered']))->toThrow(LogicException::class)
        ->and(fn () => $log->delete())->toThrow(LogicException::class);
});

it('filters audit records inside assigned branch scope and protects details', function () {
    $tenant = Tenant::factory()->create();
    $branch = Branch::factory()->for($tenant)->create();
    $otherBranch = Branch::factory()->for($tenant)->create();
    $user = $this->userWithPermissions($tenant, ['audit.view']);
    $user->branches()->attach($branch, ['is_primary' => true]);
    $own = AuditLog::withoutGlobalScopes()->create([
        'tenant_id' => $tenant->id, 'branch_id' => $branch->id, 'actor_id' => $user->id,
        'action' => 'own.action', 'auditable_type' => 'User', 'auditable_id' => $user->id,
        'entity_identifier' => (string) $user->id,
    ]);
    $hidden = AuditLog::withoutGlobalScopes()->create([
        'tenant_id' => $tenant->id, 'branch_id' => $otherBranch->id, 'actor_id' => $user->id,
        'action' => 'hidden.action', 'auditable_type' => 'User', 'auditable_id' => $user->id,
        'entity_identifier' => (string) $user->id,
    ]);

    $this->actingAs($user)->getJson('/api/v1/audit-logs')
        ->assertOk()->assertJsonCount(1, 'data')->assertJsonPath('data.0.id', $own->id);
    $this->actingAs($user)->getJson("/api/v1/audit-logs/{$hidden->id}")->assertNotFound();
});

it('filters audit logs by actor, action prefix and date range', function () {
    $tenant = Tenant::factory()->create();
    $branch = Branch::factory()->for($tenant)->create();
    $actor = $this->userWithPermissions($tenant, ['audit.view']);
    $otherActor = $this->userWithPermissions($tenant, []);
    $actor->branches()->attach($branch, ['is_primary' => true]);
    // 'created_at' is intentionally excluded from AuditLog's fillable list (append-only
    // model), so backdating a log for this test must bypass mass assignment via
    // forceFill on a not-yet-persisted instance (an insert, not the guarded update path).
    $auditLogAt = function (array $attrs, string $createdAt) {
        $log = new AuditLog($attrs);
        $log->forceFill($attrs + ['created_at' => CarbonImmutable::parse($createdAt)]);
        $log->save();

        return $log;
    };
    $match = $auditLogAt([
        'tenant_id' => $tenant->id, 'branch_id' => $branch->id, 'actor_id' => $actor->id,
        'action' => 'member.updated', 'auditable_type' => 'User', 'auditable_id' => $actor->id,
        'entity_identifier' => (string) $actor->id,
    ], '2026-05-10');
    $auditLogAt([
        'tenant_id' => $tenant->id, 'branch_id' => $branch->id, 'actor_id' => $otherActor->id,
        'action' => 'member.updated', 'auditable_type' => 'User', 'auditable_id' => $otherActor->id,
        'entity_identifier' => (string) $otherActor->id,
    ], '2026-05-10');
    $auditLogAt([
        'tenant_id' => $tenant->id, 'branch_id' => $branch->id, 'actor_id' => $actor->id,
        'action' => 'billing.refunded', 'auditable_type' => 'User', 'auditable_id' => $actor->id,
        'entity_identifier' => (string) $actor->id,
    ], '2026-05-10');
    $auditLogAt([
        'tenant_id' => $tenant->id, 'branch_id' => $branch->id, 'actor_id' => $actor->id,
        'action' => 'member.updated', 'auditable_type' => 'User', 'auditable_id' => $actor->id,
        'entity_identifier' => (string) $actor->id,
    ], '2020-01-01');

    $this->actingAs($actor)->getJson('/api/v1/audit-logs?'.http_build_query([
        'actor_id' => $actor->id,
        'action' => 'member.',
        'date_from' => '2026-05-01',
        'date_to' => '2026-05-31',
    ]))->assertOk()->assertJsonCount(1, 'data')->assertJsonPath('data.0.id', $match->id);
});

it('returns not found for another tenant audit log via route-model binding', function () {
    $tenant = Tenant::factory()->create();
    $branch = Branch::factory()->for($tenant)->create();
    $log = AuditLog::withoutGlobalScopes()->create([
        'tenant_id' => $tenant->id, 'branch_id' => $branch->id, 'actor_id' => null,
        'action' => 'member.updated', 'auditable_type' => 'User', 'auditable_id' => 1,
        'entity_identifier' => '1',
    ]);

    $otherTenant = Tenant::factory()->create();
    $otherUser = $this->userWithPermissions($otherTenant, ['audit.view']);

    $this->actingAs($otherUser)->getJson("/api/v1/audit-logs/{$log->id}")->assertNotFound();
});

it('filters audit logs by support-access context', function () {
    $tenant = Tenant::factory()->create();
    $branch = Branch::factory()->for($tenant)->create();
    $actor = $this->userWithPermissions($tenant, ['audit.view']);
    $actor->branches()->attach($branch, ['is_primary' => true]);
    $supportLog = app(AuditLogger::class)->log(
        $actor, 'support.accessed', $actor, [], [], [], ['support_access' => true], $branch->id,
    );
    app(AuditLogger::class)->log(
        $actor, 'member.viewed', $actor, [], [], [], ['support_access' => false], $branch->id,
    );

    $this->actingAs($actor)->getJson('/api/v1/audit-logs?support_access=1')
        ->assertOk()->assertJsonCount(1, 'data')->assertJsonPath('data.0.id', $supportLog->id);
});

it('queues an audit export scoped to the authorized branch and records the request', function () {
    Queue::fake();
    $tenant = Tenant::factory()->create();
    $branch = Branch::factory()->for($tenant)->create();
    $unassigned = Branch::factory()->for($tenant)->create();
    $actor = $this->userWithPermissions($tenant, ['audit.export']);
    $actor->branches()->attach($branch, ['is_primary' => true]);

    $this->actingAs($actor)->postJson('/api/v1/audit-logs/exports', [
        'date_from' => '2026-01-01', 'date_to' => '2026-01-31', 'branch_id' => $unassigned->id,
    ])->assertForbidden();

    $response = $this->actingAs($actor)->postJson('/api/v1/audit-logs/exports', [
        'date_from' => '2026-01-01', 'date_to' => '2026-01-31', 'branch_id' => $branch->id,
    ])->assertCreated()->assertJsonPath('data.status', 'queued');

    Queue::assertPushed(GenerateAuditExportJob::class);
    $export = ReportExport::withoutGlobalScopes()->find($response->json('data.id'));
    expect($export->report_key)->toBe('audit-logs')
        ->and(AuditLog::withoutGlobalScopes()->where('action', 'audit_export.created')->exists())->toBeTrue();
});
