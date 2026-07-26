<?php

use App\Models\Branch;
use App\Models\Member;
use App\Models\Permission;
use App\Models\Role;
use App\Models\Tenant;
use App\Models\User;
use App\Modules\Attendance\Models\AttendanceRecord;
use App\Modules\Billing\Models\Invoice;
use App\Modules\Billing\Models\Payment;
use App\Modules\Membership\Models\Membership;
use App\Modules\Notification\Models\NotificationDelivery;
use App\Modules\Report\Providers\ReportServiceProvider;
use Carbon\CarbonImmutable;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Concerns\InteractsWithPermissions;

uses(RefreshDatabase::class, InteractsWithPermissions::class);

beforeEach(function () {
    $this->app->register(ReportServiceProvider::class);
});

function reportActor(array $permissions): array
{
    $tenant = Tenant::factory()->create(['currency' => 'LKR', 'timezone' => 'Asia/Colombo']);
    $branch = Branch::factory()->for($tenant)->create();
    $user = reportUser($tenant, $permissions);
    $user->branches()->attach($branch, ['is_primary' => true]);

    return [$tenant, $branch, $user];
}

function reportUser(Tenant $tenant, array $permissions): User
{
    $user = User::factory()->create(['tenant_id' => $tenant->id]);
    $role = Role::factory()->create(['tenant_id' => $tenant->id]);
    $role->permissions()->sync(collect($permissions)->map(
        fn (string $slug) => Permission::query()->firstOrCreate(['slug' => $slug], ['name' => $slug])->id,
    ));
    $user->roles()->attach($role);

    return $user;
}

it('returns a permission-filtered catalogue and rejects excessive date ranges', function () {
    [, $branch, $user] = reportActor(['reports.view', 'reports.attendance.view']);
    $this->actingAs($user)->getJson('/api/v1/reports/catalogue')
        ->assertOk()->assertJsonPath('data.0.key', 'daily-attendance');
    $this->actingAs($user)->getJson("/api/v1/reports/daily-attendance?branch_id={$branch->id}&date_from=2020-01-01&date_to=2026-01-01")
        ->assertUnprocessable();
});

it('aggregates attendance within authorized tenant and branch only', function () {
    [$tenant, $branch, $user] = reportActor(['reports.attendance.view']);
    $member = Member::factory()->for($tenant)->create(['branch_id' => $branch->id]);
    AttendanceRecord::withoutGlobalScopes()->create([
        'tenant_id' => $tenant->id, 'branch_id' => $branch->id,
        'member_id' => $member->id, 'request_id' => fake()->uuid(),
        'status' => 'checked_in', 'source' => 'manual', 'checked_in_at' => now(),
    ]);

    $this->actingAs($user)->getJson("/api/v1/reports/daily-attendance?branch_id={$branch->id}")
        ->assertOk()->assertJsonPath('data.kpis.rows', 1)
        ->assertJsonPath('data.rows.0.check_ins', 1);
});

it('reconciles collection report amounts from billing ledger records', function () {
    [$tenant, $branch, $user] = reportActor(['reports.financial.view']);
    $invoice = Invoice::factory()->for($tenant)->create(['branch_id' => $branch->id]);
    Payment::factory()->for($invoice)->create([
        'tenant_id' => $tenant->id, 'branch_id' => $branch->id, 'amount_cents' => 2500,
    ]);

    $this->actingAs($user)->getJson("/api/v1/reports/collections?branch_id={$branch->id}")
        ->assertOk()->assertJsonPath('data.kpis.gross_cents', 2500)
        ->assertJsonPath('data.kpis.net_cents', 2500);
});

it('denies cross-branch and cross-tenant report access', function () {
    [$tenant, , $user] = reportActor(['reports.attendance.view']);
    $unassigned = Branch::factory()->for($tenant)->create();
    $this->actingAs($user)->getJson("/api/v1/reports/daily-attendance?branch_id={$unassigned->id}")->assertForbidden();

    $other = Tenant::factory()->create();
    $otherBranch = Branch::factory()->for($other)->create();
    $this->actingAs($user)->getJson("/api/v1/reports/daily-attendance?branch_id={$otherBranch->id}")->assertForbidden();
});

it('rejects unsupported filters and unbounded pagination', function () {
    [, $branch, $user] = reportActor(['reports.attendance.view']);

    $this->actingAs($user)
        ->getJson("/api/v1/reports/daily-attendance?branch_id={$branch->id}&plan_id=1")
        ->assertUnprocessable()->assertJsonValidationErrors('plan_id');
    $this->actingAs($user)
        ->getJson("/api/v1/reports/daily-attendance?branch_id={$branch->id}&per_page=101")
        ->assertUnprocessable()->assertJsonValidationErrors('per_page');
});

it('groups attendance by the gym timezone at UTC day and hour boundaries', function () {
    [$tenant, $branch, $user] = reportActor(['reports.attendance.view']);
    $member = Member::factory()->for($tenant)->create(['branch_id' => $branch->id]);
    AttendanceRecord::withoutGlobalScopes()->create([
        'tenant_id' => $tenant->id,
        'branch_id' => $branch->id,
        'member_id' => $member->id,
        'request_id' => fake()->uuid(),
        'status' => 'checked_in',
        'source' => 'manual',
        'checked_in_at' => CarbonImmutable::parse('2026-07-01 20:00:00', 'UTC'),
    ]);
    $query = "branch_id={$branch->id}&date_from=2026-07-02&date_to=2026-07-02";

    $this->actingAs($user)->getJson('/api/v1/reports/daily-attendance?'.$query)
        ->assertOk()
        ->assertJsonPath('data.rows.0.date', '2026-07-02')
        ->assertJsonPath('data.rows.0.check_ins', 1);
    $this->actingAs($user)->getJson('/api/v1/reports/peak-hours?'.$query)
        ->assertOk()
        ->assertJsonPath('data.rows.0.hour', 1)
        ->assertJsonPath('data.rows.0.visits', 1);
});

it('applies payment method filters to sales and refunds without copying ledger values', function () {
    [$tenant, $branch, $user] = reportActor(['reports.financial.view']);
    $cashInvoice = Invoice::factory()->for($tenant)->create([
        'branch_id' => $branch->id,
        'issued_on' => now()->toDateString(),
        'grand_total_cents' => 3000,
    ]);
    Payment::factory()->for($cashInvoice)->create([
        'tenant_id' => $tenant->id,
        'branch_id' => $branch->id,
        'method' => 'cash',
        'amount_cents' => 3000,
    ]);
    $cardInvoice = Invoice::factory()->for($tenant)->create([
        'branch_id' => $branch->id,
        'issued_on' => now()->toDateString(),
        'grand_total_cents' => 5000,
    ]);
    Payment::factory()->for($cardInvoice)->create([
        'tenant_id' => $tenant->id,
        'branch_id' => $branch->id,
        'method' => 'card',
        'amount_cents' => 5000,
    ]);

    $this->actingAs($user)
        ->getJson("/api/v1/reports/sales?branch_id={$branch->id}&payment_method=cash")
        ->assertOk()
        ->assertJsonPath('data.meta.total', 1)
        ->assertJsonPath('data.kpis.gross_cents', 3000);
});

it('includes invoices dated on the exact upper bound of the requested date range', function () {
    [$tenant, $branch, $user] = reportActor(['reports.financial.view']);
    $today = now()->toDateString();
    $invoice = Invoice::factory()->for($tenant)->create([
        'branch_id' => $branch->id,
        'issued_on' => $today,
        'grand_total_cents' => 4200,
        'balance_due_cents' => 4200,
    ]);

    $this->actingAs($user)
        ->getJson("/api/v1/reports/sales?branch_id={$branch->id}&date_from={$today}&date_to={$today}")
        ->assertOk()
        ->assertJsonPath('data.meta.total', 1)
        ->assertJsonPath('data.rows.0.invoice_id', $invoice->id);

    $this->actingAs($user)
        ->getJson("/api/v1/reports/outstanding-balances?branch_id={$branch->id}&date_from={$today}&date_to={$today}")
        ->assertOk()
        ->assertJsonPath('data.meta.total', 1)
        ->assertJsonPath('data.rows.0.invoice_id', $invoice->id);
});

it('paginates member frequency and aggregates branch performance', function () {
    [$tenant, $branch, $user] = reportActor([
        'reports.attendance.view',
        'reports.branch-performance.view',
    ]);
    $members = Member::factory()->count(2)->for($tenant)->create(['branch_id' => $branch->id]);
    foreach ($members as $member) {
        AttendanceRecord::withoutGlobalScopes()->create([
            'tenant_id' => $tenant->id,
            'branch_id' => $branch->id,
            'member_id' => $member->id,
            'request_id' => fake()->uuid(),
            'status' => 'checked_in',
            'source' => 'manual',
            'checked_in_at' => now(),
        ]);
    }
    Membership::factory()->for($tenant)->create([
        'branch_id' => $branch->id,
        'member_id' => $members->first()->id,
        'sold_at' => now(),
    ]);
    $invoice = Invoice::factory()->for($tenant)->create(['branch_id' => $branch->id]);
    Payment::factory()->for($invoice)->create([
        'tenant_id' => $tenant->id,
        'branch_id' => $branch->id,
        'amount_cents' => 4200,
        'paid_at' => now(),
    ]);

    $this->actingAs($user)
        ->getJson("/api/v1/reports/member-frequency?branch_id={$branch->id}&per_page=1")
        ->assertOk()
        ->assertJsonCount(1, 'data.rows')
        ->assertJsonPath('data.meta.total', 2)
        ->assertJsonPath('data.meta.last_page', 2);
    $this->actingAs($user)
        ->getJson("/api/v1/reports/branch-performance?branch_id={$branch->id}")
        ->assertOk()
        ->assertJsonPath('data.rows.0.attendance', 2)
        ->assertJsonPath('data.rows.0.membership_sales', 1)
        ->assertJsonPath('data.rows.0.collections_cents', 4200);
});

it('returns print-friendly report data and notification delivery totals', function () {
    [$tenant, $branch, $user] = reportActor([
        'reports.attendance.view',
        'reports.notification-delivery.view',
    ]);
    NotificationDelivery::withoutGlobalScopes()->create([
        'tenant_id' => $tenant->id,
        'branch_id' => $branch->id,
        'channel' => 'email',
        'recipient' => 'member@example.test',
        'status' => 'failed',
        'idempotency_key' => fake()->uuid(),
    ]);

    $this->actingAs($user)
        ->getJson("/api/v1/reports/daily-attendance/print?branch_id={$branch->id}")
        ->assertOk()->assertJsonPath('data.print_friendly', true);
    $this->actingAs($user)
        ->getJson("/api/v1/reports/notification-delivery?branch_id={$branch->id}")
        ->assertOk()
        ->assertJsonPath('data.rows.0.channel', 'email')
        ->assertJsonPath('data.rows.0.status', 'failed')
        ->assertJsonPath('data.rows.0.total', 1);
});
