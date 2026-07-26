<?php

namespace App\Modules\Billing\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Billing\Models\Invoice;
use App\Modules\Billing\Requests\StoreInvoiceRequest;
use App\Modules\Billing\Resources\InvoiceResource;
use App\Modules\Billing\Services\BillingAuthorizer;
use App\Modules\Billing\Services\InvoiceCreatorService;
use App\Shared\Support\ApiResponse;
use App\Tenancy\Services\BranchContext;
use DomainException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    public function index(Request $request, BillingAuthorizer $authorizer, BranchContext $branches): JsonResponse
    {
        $branchId = $branches->id();
        abort_unless($branchId !== null, 403, 'Select an assigned branch.');
        $authorizer->authorize($request->user(), 'billing.invoices.view', branchId: $branchId);

        $invoices = Invoice::query()
            ->where('branch_id', $branchId)
            ->with(['member', 'branch'])
            ->when($request->string('search')->toString(), fn ($query, $search) => $query
                ->where(fn ($q) => $q->where('invoice_number', 'like', "%{$search}%")
                    ->orWhereHas('member', fn ($member) => $member
                        ->where('member_number', 'like', "%{$search}%")
                        ->orWhere('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%"))))
            ->when($request->string('status')->toString(), fn ($query, $status) => $query->where('status', $status))
            ->when($request->date('from'), fn ($query, $from) => $query->whereDate('issued_on', '>=', $from))
            ->when($request->date('to'), fn ($query, $to) => $query->whereDate('issued_on', '<=', $to))
            ->latest('issued_on')
            ->latest('id')
            ->paginate(min(max($request->integer('per_page', 20), 1), 100));

        return ApiResponse::paginated($invoices->through(
            fn (Invoice $invoice) => (new InvoiceResource($invoice))->resolve(),
        ));
    }

    public function store(
        StoreInvoiceRequest $request,
        BillingAuthorizer $authorizer,
        InvoiceCreatorService $creator,
    ): JsonResponse {
        $data = $request->invoiceData();
        $authorizer->authorize($request->user(), 'billing.invoices.create', branchId: $data['branch_id']);
        $data['created_by'] = $request->user()->id;

        try {
            $invoice = $creator->create($data);
        } catch (DomainException $exception) {
            return ApiResponse::error($exception->getMessage(), 409);
        }

        return ApiResponse::created((new InvoiceResource($invoice))->resolve(), 'Invoice created.');
    }

    public function show(Invoice $invoice, Request $request, BillingAuthorizer $authorizer): JsonResponse
    {
        $authorizer->authorize($request->user(), 'billing.invoices.view', $invoice);
        $invoice->load([
            'member', 'branch', 'items',
            'payments' => fn ($query) => $query->with('receipt')->withSum('refunds', 'amount_cents')->oldest('paid_at'),
            'refunds' => fn ($query) => $query->oldest('refunded_at'),
        ]);

        return ApiResponse::success((new InvoiceResource($invoice))->resolve());
    }
}
