<?php

namespace App\Modules\Billing\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Billing\Models\Invoice;
use App\Modules\Billing\Models\Payment;
use App\Modules\Billing\Requests\RecordPaymentRequest;
use App\Modules\Billing\Requests\RecordSplitPaymentRequest;
use App\Modules\Billing\Resources\PaymentResource;
use App\Modules\Billing\Services\BillingAuthorizer;
use App\Modules\Billing\Services\PaymentRecorderService;
use App\Shared\Support\ApiResponse;
use App\Tenancy\Services\BranchContext;
use DomainException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    public function index(Request $request, BillingAuthorizer $authorizer, BranchContext $branches): JsonResponse
    {
        $branchId = $branches->id();
        abort_unless($branchId !== null, 403, 'Select an assigned branch.');
        $authorizer->authorize($request->user(), 'billing.payments.view', branchId: $branchId);

        $payments = Payment::query()
            ->where('branch_id', $branchId)
            ->with(['invoice.member', 'receipt'])
            ->withSum('refunds', 'amount_cents')
            ->when($request->string('method')->toString(), fn ($query, $method) => $query->where('method', $method))
            ->latest('paid_at')
            ->paginate(min(max($request->integer('per_page', 20), 1), 100));

        return ApiResponse::paginated($payments->through(
            fn (Payment $payment) => (new PaymentResource($payment))->resolve(),
        ));
    }

    public function store(
        Invoice $invoice,
        RecordPaymentRequest $request,
        BillingAuthorizer $authorizer,
        PaymentRecorderService $recorder,
    ): JsonResponse {
        $authorizer->authorize($request->user(), 'billing.payments.record', $invoice);
        $data = $request->paymentData();
        $data['recorded_by'] = $request->user()->id;
        if ($data['installment_number'] !== null) {
            $data['metadata'] = array_merge($data['metadata'] ?? [], [
                'installment_number' => $data['installment_number'],
            ]);
        }

        try {
            $payment = $recorder->record($invoice, $data);
        } catch (DomainException $exception) {
            return ApiResponse::error($exception->getMessage(), str_contains($exception->getMessage(), 'idempotency') ? 409 : 422);
        }

        return ApiResponse::created((new PaymentResource($payment))->resolve(), 'Payment recorded.');
    }

    public function split(
        Invoice $invoice,
        RecordSplitPaymentRequest $request,
        BillingAuthorizer $authorizer,
        PaymentRecorderService $recorder,
    ): JsonResponse {
        $authorizer->authorize($request->user(), 'billing.payments.record', $invoice);
        $data = $request->splitData();

        try {
            $payments = DB::transaction(function () use ($data, $invoice, $request, $recorder) {
                return collect($data['payments'])->map(function (array $part, int $index) use ($data, $invoice, $request, $recorder) {
                    $part['idempotency_key'] = $data['idempotency_key'].':'.($index + 1);
                    $part['recorded_by'] = $request->user()->id;
                    $part['metadata'] = array_merge($part['metadata'] ?? [], [
                        'split_batch_key' => $data['idempotency_key'],
                        'split_part' => $index + 1,
                    ]);

                    return $recorder->record($invoice->refresh(), $part);
                });
            });
        } catch (DomainException $exception) {
            return ApiResponse::error($exception->getMessage(), str_contains($exception->getMessage(), 'idempotency') ? 409 : 422);
        }

        return ApiResponse::created(
            PaymentResource::collection($payments)->resolve(),
            'Split payment recorded.',
        );
    }
}
