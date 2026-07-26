<?php

namespace App\Modules\Billing\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Billing\Enums\InvoiceStatus;
use App\Modules\Billing\Models\Invoice;
use App\Modules\Billing\Requests\VoidInvoiceRequest;
use App\Modules\Billing\Resources\InvoiceResource;
use App\Modules\Billing\Services\BillingAuthorizer;
use App\Modules\Billing\Services\BillingEventStore;
use App\Shared\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class VoidInvoiceController extends Controller
{
    public function __invoke(
        Invoice $invoice,
        VoidInvoiceRequest $request,
        BillingAuthorizer $authorizer,
        BillingEventStore $events,
    ): JsonResponse {
        $authorizer->authorize($request->user(), 'billing.invoices.void', $invoice);

        $result = DB::transaction(function () use ($invoice, $request, $events): ?Invoice {
            $locked = Invoice::query()->lockForUpdate()->findOrFail($invoice->id);
            if ($locked->payments()->exists()) {
                return null;
            }
            if (! $locked->isVoid()) {
                $locked->update([
                    'status' => InvoiceStatus::Void,
                    'balance_due_cents' => 0,
                    'voided_at' => now(),
                    'voided_by' => $request->user()->id,
                    'void_reason' => $request->validated('reason'),
                ]);
                $events->record('InvoiceVoided', $locked, ['reason' => $locked->void_reason]);
            }

            return $locked;
        });

        if (! $result) {
            return ApiResponse::error('An invoice with payment history cannot be voided; refund it instead.', 422);
        }

        return ApiResponse::success((new InvoiceResource($result))->resolve(), 'Invoice voided.');
    }
}
