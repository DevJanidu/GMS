<?php

namespace App\Modules\Billing\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Billing\Models\Payment;
use App\Modules\Billing\Models\Refund;
use App\Modules\Billing\Requests\RefundPaymentRequest;
use App\Modules\Billing\Resources\RefundResource;
use App\Modules\Billing\Services\BillingAuthorizer;
use App\Modules\Billing\Services\RefundProcessor;
use App\Shared\Support\ApiResponse;
use DomainException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RefundController extends Controller
{
    public function store(
        Payment $payment,
        RefundPaymentRequest $request,
        BillingAuthorizer $authorizer,
        RefundProcessor $processor,
    ): JsonResponse {
        $payment->loadMissing('invoice');
        $authorizer->authorize($request->user(), 'billing.refunds.create', $payment->invoice);
        $data = $request->refundData();
        $data['refunded_by'] = $request->user()->id;

        try {
            $refund = $processor->refund($payment, $data);
        } catch (DomainException $exception) {
            return ApiResponse::error($exception->getMessage(), str_contains($exception->getMessage(), 'idempotency') ? 409 : 422);
        }

        return ApiResponse::created((new RefundResource($refund))->resolve(), 'Refund processed.');
    }

    public function show(Refund $refund, Request $request, BillingAuthorizer $authorizer): JsonResponse
    {
        $refund->loadMissing('invoice');
        $authorizer->authorize($request->user(), 'billing.refunds.view', $refund->invoice);

        return ApiResponse::success((new RefundResource($refund))->resolve());
    }
}
