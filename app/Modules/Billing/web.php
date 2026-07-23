<?php

use App\Tenancy\Services\BranchContext;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified', 'tenant', 'branch'])
    ->prefix('billing')
    ->name('billing.')
    ->group(function () {
        Route::get('invoices', fn () => Inertia::render('billing/invoices'))
            ->name('invoices.index');

        Route::get('invoices/create', function (BranchContext $branch) {
            abort_unless($branch->id() !== null, 403, 'Select an assigned branch.');

            return Inertia::render('billing/invoices/create', [
                'branchId' => $branch->id(),
            ]);
        })->name('invoices.create');

        Route::get('invoices/{invoiceId}', fn (int $invoiceId) => Inertia::render(
            'billing/invoices/show',
            ['invoiceId' => $invoiceId],
        ))->name('invoices.show');

        Route::get('payments', fn () => Inertia::render('billing/payments'))
            ->name('payments.index');

        Route::get('receipts/{receiptId}', fn (int $receiptId) => Inertia::render(
            'billing/receipts/show',
            ['receiptId' => $receiptId],
        ))->name('receipts.show');

        Route::get('outstanding', fn () => Inertia::render('billing/outstanding'))
            ->name('outstanding.index');

        Route::get('collections', fn () => Inertia::render('billing/collections'))
            ->name('collections.index');
    });
