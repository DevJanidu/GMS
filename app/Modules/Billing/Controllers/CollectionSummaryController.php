<?php

namespace App\Modules\Billing\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Billing\Models\Payment;
use App\Modules\Billing\Models\Refund;
use App\Modules\Billing\Services\BillingAuthorizer;
use App\Shared\Support\ApiResponse;
use App\Tenancy\Services\BranchContext;
use Carbon\CarbonImmutable;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CollectionSummaryController extends Controller
{
    public function __invoke(Request $request, BillingAuthorizer $authorizer, BranchContext $branches): JsonResponse
    {
        $branchId = $branches->id();
        abort_unless($branchId !== null, 403, 'Select an assigned branch.');
        $authorizer->authorize($request->user(), 'billing.collections.view', branchId: $branchId);
        $validated = validator($request->all(), [
            'from' => ['nullable', 'date'],
            'to' => ['nullable', 'date', 'after_or_equal:from'],
        ])->validate();
        $from = CarbonImmutable::parse($validated['from'] ?? now()->toDateString())->startOfDay();
        $to = CarbonImmutable::parse($validated['to'] ?? $from->toDateString())->endOfDay();

        $payments = Payment::query()->where('branch_id', $branchId)
            ->whereBetween('paid_at', [$from, $to])->get(['amount_cents', 'method', 'paid_at']);
        $refunds = Refund::query()->where('branch_id', $branchId)
            ->whereBetween('refunded_at', [$from, $to])->with('payment:id,method')->get();
        $methods = collect(['cash', 'card', 'bank_transfer', 'online'])->mapWithKeys(function (string $method) use ($payments, $refunds) {
            $gross = $payments->where('method.value', $method)->sum('amount_cents');
            $refunded = $refunds->filter(fn (Refund $refund) => $refund->payment->method->value === $method)->sum('amount_cents');

            return [$method => ['gross_cents' => $gross, 'refunded_cents' => $refunded, 'net_cents' => $gross - $refunded]];
        });
        $daily = $payments->groupBy(fn (Payment $payment) => $payment->paid_at->toDateString())
            ->map(fn ($day, $date) => [
                'date' => $date,
                'gross_cents' => $day->sum('amount_cents'),
                'payment_count' => $day->count(),
            ])->values();

        return ApiResponse::success([
            'from' => $from->toDateString(),
            'to' => $to->toDateString(),
            'gross_cents' => $payments->sum('amount_cents'),
            'refunded_cents' => $refunds->sum('amount_cents'),
            'net_cents' => $payments->sum('amount_cents') - $refunds->sum('amount_cents'),
            'payment_count' => $payments->count(),
            'refund_count' => $refunds->count(),
            'by_method' => $methods,
            'daily' => $daily,
        ]);
    }
}
