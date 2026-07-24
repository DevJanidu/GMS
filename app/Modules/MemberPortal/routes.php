<?php

use App\Modules\MemberPortal\Controllers\MemberPortalController;
use App\Modules\MemberPortal\Middleware\EnsureMemberPortalAccess;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'tenant', EnsureMemberPortalAccess::class])
    ->prefix('member-portal')
    ->name('api.member-portal.')
    ->group(function () {
        Route::get('dashboard', [MemberPortalController::class, 'dashboard'])->name('dashboard');
        Route::get('profile', [MemberPortalController::class, 'profile'])->name('profile.show');
        Route::put('profile', [MemberPortalController::class, 'updateProfile'])->name('profile.update');
        Route::get('qr-card', [MemberPortalController::class, 'qrCard'])->name('qr-card');
        Route::get('membership', [MemberPortalController::class, 'membership'])->name('membership');
        Route::get('payments', [MemberPortalController::class, 'payments'])->name('payments');
        Route::get('receipts', [MemberPortalController::class, 'receipts'])->name('receipts.index');
        Route::get('receipts/{receipt}', [MemberPortalController::class, 'receipt'])->name('receipts.show');
        Route::get('attendance', [MemberPortalController::class, 'attendance'])->name('attendance');
        Route::get('notifications', [MemberPortalController::class, 'notifications'])->name('notifications');
        Route::patch('notifications/{notification}/read', [MemberPortalController::class, 'markNotificationRead'])->name('notifications.read');
        Route::patch('notifications/{notification}/unread', [MemberPortalController::class, 'markNotificationUnread'])->name('notifications.unread');
        Route::post('notifications/mark-all-read', [MemberPortalController::class, 'markAllNotificationsRead'])->name('notifications.mark-all-read');
    });
