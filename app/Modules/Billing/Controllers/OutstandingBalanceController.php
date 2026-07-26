<?php

namespace App\Modules\Billing\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Billing\Models\Invoice;
use App\Modules\Billing\Resources\InvoiceResource;
use App\Modules\Billing\Services\BillingAuthorizer;
use App\Shared\Support\ApiResponse;
use App\Tenancy\Services\BranchContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OutstandingBalanceController extends Controller
{
    public function __invoke(Request $request, BillingAuthorizer $authorizer, BranchContext $branches): JsonResponse
    {
        $branchId = $branches->id();
        abort_unless($branchId !== null, 403, 'Select an assigned branch.');
        $authorizer->authorize($request->user(), 'billing.outstanding.view', branchId: $branchId);

        $query = Invoice::query()
            ->where('branch_id', $branchId)
            ->where('balance_due_cents', '>', 0)
            ->where('status', '!=', 'void')
            ->with(['member', 'branch'])
            ->orderBy('due_on')
            ->orderBy('issued_on');
        $total = (clone $query)->sum('balance_due_cents');
        $invoices = $query->paginate(min(max($request->integer('per_page', 20), 1), 100));

        $response = ApiResponse::paginated($invoices->through(
            fn (Invoice $invoice) => (new InvoiceResource($invoice))->resolve(),
        ));
        $payload = $response->getData(true);
        $payload['summary'] = ['invoice_count' => $invoices->total(), 'outstanding_cents' => (int) $total];

        return response()->json($payload);
    }
}
