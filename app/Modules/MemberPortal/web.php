<?php

use App\Modules\MemberPortal\Middleware\EnsureMemberPortalAccess;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'tenant', EnsureMemberPortalAccess::class])
    ->prefix('member-portal')
    ->name('member-portal.')
    ->group(function () {
        Route::inertia('/', 'member-portal/dashboard')->name('dashboard');
        Route::inertia('/qr-card', 'member-portal/qr-card')->name('qr-card');
        Route::inertia('/membership', 'member-portal/membership')->name('membership');
        Route::inertia('/payments', 'member-portal/payments')->name('payments');
        Route::inertia('/receipts', 'member-portal/receipts')->name('receipts');
        Route::inertia('/attendance', 'member-portal/attendance')->name('attendance');
        Route::inertia('/notifications', 'member-portal/notifications')->name('notifications');
        Route::inertia('/profile', 'member-portal/profile')->name('profile');
    });
