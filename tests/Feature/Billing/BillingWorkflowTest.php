<?php

use App\Models\Branch;
use App\Models\Permission;
use App\Models\Role;
use App\Models\Tenant;
use App\Models\User;
use App\Modules\Billing\Models\BillingEvent;
use App\Modules\Billing\Models\Invoice;
use App\Modules\Billing\Models\Payment;
use App\Modules\Billing\Models\Refund;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Route;
use Tests\Concerns\InteractsWithPermissions;

uses(RefreshDatabase::class, InteractsWithPermissions::class);

beforeEach(function () {
    if (! Route::has('api.billing.invoices.index')) {
        Route::middleware('api')->prefix('api/v1')->group(function () {
            require app_path('Modules/Billing/routes.php');
        });
    }
});

function billingActor(array $permissions): array
{
    $tenant = Tenant::factory()->create(['currency' => 'LKR']);
    $branch = Branch::factory()->for($tenant)->create();
    $user = billingUser($tenant, $permissions);
    $user->branches()->attach($branch, ['is_primary' => true]);

    return [$tenant, $branch, $user];
}

function billingUser(Tenant $tenant, array $permissions): User
{
    $user = User::factory()->create(['tenant_id' => $tenant->id]);
    $role = Role::factory()->create(['tenant_id' => $tenant->id]);
    $permissionModels = collect($permissions)->map(
        fn (string $slug) => Permission::query()->firstOrCreate(
            ['slug' => $slug],
            ['name' => $slug],
        ),
    );
    $role->permissions()->sync($permissionModels->pluck('id'));
    $user->roles()->attach($role);

    return $user;
}

function createBillingInvoice(object $test, $user, Branch $branch, array $overrides = []): Invoice
{
    $payload = array_replace_recursive([
        'branch_id' => $branch->id,
        'currency' => 'LKR',
        'discount_type' => 'percentage',
        'discount_value' => 1000,
        'tax_rate_basis_points' => 1000,
        'joining_fee_cents' => 1000,
        'idempotency_key' => 'invoice-key-1',
        'items' => [
            ['description' => 'Monthly membership', 'quantity' => 2, 'unit_price_cents' => 5000],
        ],
    ], $overrides);

    $test->actingAs($user)
        ->withHeader('X-Branch-Id', (string) $branch->id)
        ->postJson('/api/v1/billing/invoices', $payload)
        ->assertCreated();

    return Invoice::query()->latest('id')->firstOrFail();
}

it('creates an accurately calculated branch-scoped invoice and durable event', function () {
    [$tenant, $branch, $user] = billingActor(['billing.invoices.create']);

    $invoice = createBillingInvoice($this, $user, $branch);
    expect($invoice->tenant_id)->toBe($tenant->id)
        ->and($invoice->subtotal_cents)->toBe(10000)
        ->and($invoice->discount_cents)->toBe(1000)
        ->and($invoice->joining_fee_cents)->toBe(1000)
        ->and($invoice->tax_cents)->toBe(1000)
        ->and($invoice->grand_total_cents)->toBe(11000)
        ->and($invoice->balance_due_cents)->toBe(11000)
        ->and($invoice->items)->toHaveCount(1);

    expect(BillingEvent::query()->where('event_type', 'InvoiceCreated')->count())->toBe(1);
});

it('makes invoice creation idempotent and rejects reuse with different input', function () {
    [, $branch, $user] = billingActor(['billing.invoices.create']);
    createBillingInvoice($this, $user, $branch);

    createBillingInvoice($this, $user, $branch);
    expect(Invoice::query()->count())->toBe(1);

    $this->actingAs($user)->withHeader('X-Branch-Id', (string) $branch->id)
        ->postJson('/api/v1/billing/invoices', [
            'branch_id' => $branch->id,
            'currency' => 'LKR',
            'idempotency_key' => 'invoice-key-1',
            'items' => [['description' => 'Different', 'quantity' => 1, 'unit_price_cents' => 1]],
        ])->assertConflict();
});

it('records partial installment and split payments with receipts', function () {
    [, $branch, $user] = billingActor([
        'billing.invoices.create',
        'billing.payments.record',
    ]);
    $invoice = createBillingInvoice($this, $user, $branch);
    $this->actingAs($user)->withHeader('X-Branch-Id', (string) $branch->id)
        ->postJson("/api/v1/billing/invoices/{$invoice->id}/payments", [
            'amount_cents' => 2000,
            'method' => 'cash',
            'installment_number' => 1,
            'idempotency_key' => 'payment-1',
        ])->assertCreated()->assertJsonPath('data.receipt.payment_id', 1);

    $this->actingAs($user)->withHeader('X-Branch-Id', (string) $branch->id)
        ->postJson("/api/v1/billing/invoices/{$invoice->id}/split-payments", [
            'idempotency_key' => 'split-1',
            'payments' => [
                ['amount_cents' => 3000, 'method' => 'card', 'reference' => 'CARD-1'],
                ['amount_cents' => 6000, 'method' => 'bank_transfer', 'reference' => 'BANK-1'],
            ],
        ])->assertCreated()->assertJsonCount(2, 'data');

    $invoice->refresh();
    expect($invoice->status->value)->toBe('paid')
        ->and($invoice->amount_paid_cents)->toBe(11000)
        ->and($invoice->balance_due_cents)->toBe(0)
        ->and(Payment::query()->count())->toBe(3)
        ->and($invoice->receipts()->count())->toBe(3);
});

it('replays a payment idempotently and rejects overpayment', function () {
    [, $branch, $user] = billingActor([
        'billing.invoices.create',
        'billing.payments.record',
    ]);
    $invoice = createBillingInvoice($this, $user, $branch);
    $payload = ['amount_cents' => 1000, 'method' => 'online', 'idempotency_key' => 'pay-repeat'];

    foreach ([1, 2] as $attempt) {
        $this->actingAs($user)->withHeader('X-Branch-Id', (string) $branch->id)
            ->postJson("/api/v1/billing/invoices/{$invoice->id}/payments", $payload)
            ->assertCreated();
    }
    expect(Payment::query()->count())->toBe(1);

    $this->actingAs($user)->withHeader('X-Branch-Id', (string) $branch->id)
        ->postJson("/api/v1/billing/invoices/{$invoice->id}/payments", [
            'amount_cents' => 999999,
            'method' => 'cash',
            'idempotency_key' => 'overpay',
        ])->assertUnprocessable();
});

it('processes partial and full refunds without changing original payments', function () {
    [, $branch, $user] = billingActor([
        'billing.invoices.create',
        'billing.payments.record',
        'billing.refunds.create',
    ]);
    $invoice = createBillingInvoice($this, $user, $branch);
    $this->actingAs($user)->withHeader('X-Branch-Id', (string) $branch->id)
        ->postJson("/api/v1/billing/invoices/{$invoice->id}/payments", [
            'amount_cents' => 11000,
            'method' => 'card',
            'reference' => 'ORIGINAL',
            'idempotency_key' => 'pay-refund',
        ])->assertCreated();
    $payment = Payment::query()->firstOrFail();

    foreach ([[3000, 'refund-part'], [8000, 'refund-rest']] as [$amount, $key]) {
        $this->actingAs($user)->withHeader('X-Branch-Id', (string) $branch->id)
            ->postJson("/api/v1/billing/payments/{$payment->id}/refunds", [
                'amount_cents' => $amount,
                'reason' => 'Member cancellation',
                'idempotency_key' => $key,
            ])->assertCreated();
    }

    expect($payment->refresh()->amount_cents)->toBe(11000)
        ->and($payment->reference)->toBe('ORIGINAL')
        ->and(Refund::query()->sum('amount_cents'))->toBe(11000)
        ->and($invoice->refresh()->status->value)->toBe('refunded')
        ->and($invoice->amount_paid_cents)->toBe(11000)
        ->and($invoice->amount_refunded_cents)->toBe(11000)
        ->and($invoice->balance_due_cents)->toBe(11000);
});

it('prevents mutation or deletion of payment history', function () {
    [, $branch, $user] = billingActor([
        'billing.invoices.create',
        'billing.payments.record',
    ]);
    $invoice = createBillingInvoice($this, $user, $branch);
    $this->actingAs($user)->withHeader('X-Branch-Id', (string) $branch->id)
        ->postJson("/api/v1/billing/invoices/{$invoice->id}/payments", [
            'amount_cents' => 1000, 'method' => 'cash', 'idempotency_key' => 'immutable',
        ])->assertCreated();
    $payment = Payment::query()->firstOrFail();

    expect(fn () => $payment->update(['amount_cents' => 1]))->toThrow(LogicException::class)
        ->and(fn () => $payment->delete())->toThrow(LogicException::class)
        ->and(fn () => $invoice->delete())->toThrow(LogicException::class);
});

it('enforces permissions tenant isolation and branch assignment', function () {
    [, $branch, $user] = billingActor(['billing.invoices.create']);
    $invoice = createBillingInvoice($this, $user, $branch);

    $otherTenant = Tenant::factory()->create();
    $otherBranch = Branch::factory()->for($otherTenant)->create();
    $otherUser = billingUser($otherTenant, ['billing.invoices.view']);
    $otherUser->branches()->attach($otherBranch, ['is_primary' => true]);

    $this->actingAs($otherUser)->withHeader('X-Branch-Id', (string) $otherBranch->id)
        ->getJson("/api/v1/billing/invoices/{$invoice->id}")->assertNotFound();

    $unauthorized = User::factory()->create(['tenant_id' => $invoice->tenant_id]);
    $unauthorized->branches()->attach($branch, ['is_primary' => true]);
    $this->actingAs($unauthorized)->withHeader('X-Branch-Id', (string) $branch->id)
        ->getJson('/api/v1/billing/invoices')->assertForbidden();
});

it('voids only unpaid invoices and returns collection and printable receipt output', function () {
    [, $branch, $user] = billingActor([
        'billing.invoices.create',
        'billing.invoices.void',
        'billing.payments.record',
        'billing.receipts.view',
        'billing.collections.view',
        'billing.outstanding.view',
    ]);
    $voidable = createBillingInvoice($this, $user, $branch);
    $this->actingAs($user)->withHeader('X-Branch-Id', (string) $branch->id)
        ->postJson("/api/v1/billing/invoices/{$voidable->id}/void", ['reason' => 'Created in error'])
        ->assertOk()->assertJsonPath('data.status', 'void');

    $paid = createBillingInvoice($this, $user, $branch, ['idempotency_key' => 'invoice-key-2']);
    $paymentResponse = $this->actingAs($user)->withHeader('X-Branch-Id', (string) $branch->id)
        ->postJson("/api/v1/billing/invoices/{$paid->id}/payments", [
            'amount_cents' => 1000, 'method' => 'cash', 'idempotency_key' => 'cash-collection',
        ])->assertCreated();
    $receiptId = $paymentResponse->json('data.receipt.id');

    $this->actingAs($user)->withHeader('X-Branch-Id', (string) $branch->id)
        ->postJson("/api/v1/billing/invoices/{$paid->id}/void", ['reason' => 'Not allowed'])
        ->assertUnprocessable();
    $this->actingAs($user)->withHeader('X-Branch-Id', (string) $branch->id)
        ->getJson('/api/v1/billing/collection-summary')
        ->assertOk()->assertJsonPath('data.by_method.cash.net_cents', 1000);
    $this->actingAs($user)->withHeader('X-Branch-Id', (string) $branch->id)
        ->getJson('/api/v1/billing/outstanding-balances')
        ->assertOk()->assertJsonPath('summary.outstanding_cents', 10000);
    $this->actingAs($user)->withHeader('X-Branch-Id', (string) $branch->id)
        ->get("/api/v1/billing/receipts/{$receiptId}/print")
        ->assertOk()->assertSee('Payment receipt');
});
