<?php

use App\Modules\Membership\Controllers\MembershipCancellationController;
use App\Modules\Membership\Controllers\MembershipController;
use App\Modules\Membership\Controllers\MembershipExpiredController;
use App\Modules\Membership\Controllers\MembershipExpiringController;
use App\Modules\Membership\Controllers\MembershipFreezeController;
use App\Modules\Membership\Controllers\MembershipGraceController;
use App\Modules\Membership\Controllers\MembershipReactivationController;
use App\Modules\Membership\Controllers\MembershipReminderController;
use App\Modules\Membership\Controllers\MembershipRenewalController;
use App\Modules\Membership\Controllers\MembershipResumeController;
use App\Modules\Membership\Controllers\MembershipSuspensionController;
use App\Modules\Membership\Controllers\RenewalDashboardController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'tenant', 'branch'])
    ->prefix('memberships')
    ->name('memberships.')
    ->group(function () {
        Route::get('/', [MembershipController::class, 'index'])->name('index');
        Route::get('/create', [MembershipController::class, 'create'])->name('create');
        Route::post('/', [MembershipController::class, 'store'])->name('store');
        Route::get('/{membership}', [MembershipController::class, 'show'])->name('show');
        Route::get('/{membership}/renew', [MembershipRenewalController::class, 'create'])->name('renew.create');
        Route::post('/{membership}/renew', [MembershipRenewalController::class, 'store'])->name('renew.store');
        Route::patch('/{membership}/freeze', [MembershipFreezeController::class, 'update'])->name('freeze');
        Route::patch('/{membership}/resume', [MembershipResumeController::class, 'update'])->name('resume');
        Route::patch('/{membership}/suspend', [MembershipSuspensionController::class, 'update'])->name('suspend');
        Route::patch('/{membership}/cancel', [MembershipCancellationController::class, 'update'])->name('cancel');
        Route::patch('/{membership}/reactivate', [MembershipReactivationController::class, 'update'])->name('reactivate');
    });

Route::middleware(['auth', 'verified', 'tenant', 'branch'])
    ->prefix('renewals')
    ->name('renewals.')
    ->group(function () {
        Route::get('/', [RenewalDashboardController::class, 'index'])->name('dashboard');
        Route::get('/expiring', [MembershipExpiringController::class, 'index'])->name('expiring');
        Route::get('/expired', [MembershipExpiredController::class, 'index'])->name('expired');
        Route::get('/grace', [MembershipGraceController::class, 'index'])->name('grace');
        Route::post('/reminders', [MembershipReminderController::class, 'store'])->name('reminders.store');
    });
