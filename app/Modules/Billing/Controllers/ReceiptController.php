<?php

namespace App\Modules\Billing\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Billing\Models\Receipt;
use App\Modules\Billing\Resources\ReceiptResource;
use App\Modules\Billing\Services\BillingAuthorizer;
use App\Shared\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ReceiptController extends Controller
{
    public function show(Receipt $receipt, Request $request, BillingAuthorizer $authorizer): JsonResponse
    {
        $receipt->loadMissing('invoice');
        $authorizer->authorize($request->user(), 'billing.receipts.view', $receipt->invoice);

        return ApiResponse::success((new ReceiptResource($receipt))->resolve());
    }

    public function print(Receipt $receipt, Request $request, BillingAuthorizer $authorizer): Response
    {
        $receipt->loadMissing('invoice');
        $authorizer->authorize($request->user(), 'billing.receipts.view', $receipt->invoice);
        $snapshot = $receipt->snapshot;
        $money = fn (int $cents): string => htmlspecialchars($snapshot['currency'].' '.number_format($cents / 100, 2));
        $rows = collect($snapshot['items'])->map(fn (array $item): string => sprintf(
            '<tr><td>%s</td><td>%d</td><td>%s</td></tr>',
            htmlspecialchars($item['description']),
            $item['quantity'],
            $money($item['line_total_cents']),
        ))->implode('');
        $html = sprintf(
            '<!doctype html><html><head><meta charset="utf-8"><title>%s</title><style>body{font:14px system-ui;max-width:720px;margin:32px auto;color:#111}header{display:flex;justify-content:space-between}table{width:100%%;border-collapse:collapse;margin:24px 0}td,th{padding:8px;border-bottom:1px solid #ddd;text-align:left}.total{font-size:20px;font-weight:700}@media print{button{display:none}body{margin:0}}</style></head><body><header><div><h1>Payment receipt</h1><strong>%s</strong></div><button onclick="window.print()">Print</button></header><p>Invoice: %s<br>Member: %s<br>Branch: %s<br>Paid: %s<br>Method: %s</p><table><thead><tr><th>Item</th><th>Qty</th><th>Total</th></tr></thead><tbody>%s</tbody></table><p class="total">Payment: %s</p><p>Balance due: %s</p></body></html>',
            htmlspecialchars($receipt->receipt_number),
            htmlspecialchars($receipt->receipt_number),
            htmlspecialchars($snapshot['invoice_number']),
            htmlspecialchars($snapshot['member'] ?? '—'),
            htmlspecialchars($snapshot['branch'] ?? '—'),
            htmlspecialchars($snapshot['paid_at']),
            htmlspecialchars(ucwords(str_replace('_', ' ', $snapshot['method']))),
            $rows,
            $money($snapshot['amount_cents']),
            $money($snapshot['balance_due_cents']),
        );

        return response($html)->header('Content-Security-Policy', "default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'");
    }
}
