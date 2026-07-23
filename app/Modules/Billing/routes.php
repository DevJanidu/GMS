<?php

use App\Modules\Billing\Controllers\CollectionSummaryController;
use App\Modules\Billing\Controllers\InvoiceController;
use App\Modules\Billing\Controllers\OutstandingBalanceController;
use App\Modules\Billing\Controllers\PaymentController;
use App\Modules\Billing\Controllers\ReceiptController;
use App\Modules\Billing\Controllers\RefundController;
use App\Modules\Billing\Controllers\VoidInvoiceController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'tenant', 'branch'])->prefix('billing')->name('api.billing.')->group(function () {
    Route::get('invoices', [InvoiceController::class, 'index'])->name('invoices.index');
    Route::post('invoices', [InvoiceController::class, 'store'])->name('invoices.store');
    Route::get('invoices/{invoice}', [InvoiceController::class, 'show'])->name('invoices.show');
    Route::post('invoices/{invoice}/void', VoidInvoiceController::class)->name('invoices.void');
    Route::post('invoices/{invoice}/payments', [PaymentController::class, 'store'])->name('payments.store');
    Route::post('invoices/{invoice}/split-payments', [PaymentController::class, 'split'])->name('payments.split');
    Route::get('payments', [PaymentController::class, 'index'])->name('payments.index');
    Route::post('payments/{payment}/refunds', [RefundController::class, 'store'])->name('refunds.store');
    Route::get('refunds/{refund}', [RefundController::class, 'show'])->name('refunds.show');
    Route::get('receipts/{receipt}', [ReceiptController::class, 'show'])->name('receipts.show');
    Route::get('receipts/{receipt}/print', [ReceiptController::class, 'print'])->name('receipts.print');
    Route::get('outstanding-balances', OutstandingBalanceController::class)->name('outstanding.index');
    Route::get('collection-summary', CollectionSummaryController::class)->name('collections.summary');
});
