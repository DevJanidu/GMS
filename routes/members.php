<?php

use App\Http\Controllers\MemberController;
use App\Http\Controllers\MemberDocumentController;
use App\Http\Controllers\MemberStatusController;
use App\Modules\MemberPortal\Controllers\MemberPortalInviteController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'tenant', 'branch'])
    ->prefix('members')
    ->name('members.')
    ->group(function () {
        Route::get('/', [MemberController::class, 'index'])->name('index');
        Route::get('/create', [MemberController::class, 'create'])->name('create');
        Route::post('/', [MemberController::class, 'store'])->name('store');
        Route::get('/{member}', [MemberController::class, 'show'])->name('show');
        Route::get('/{member}/edit', [MemberController::class, 'edit'])->name('edit');
        Route::put('/{member}', [MemberController::class, 'update'])->name('update');
        Route::patch('/{member}/status', [MemberStatusController::class, 'update'])->name('status.update');
        Route::post('/{member}/documents', [MemberDocumentController::class, 'store'])->name('documents.store');
        Route::delete('/{member}/documents/{document}', [MemberDocumentController::class, 'destroy'])->name('documents.destroy');
        Route::post('/{member}/portal-invite', [MemberPortalInviteController::class, 'store'])->name('portal-invite');
    });
