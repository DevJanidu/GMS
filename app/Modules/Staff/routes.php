<?php

use App\Modules\Staff\Controllers\StaffController;
use App\Modules\Staff\Controllers\StaffInvitationController;
use Illuminate\Support\Facades\Route;

Route::middleware(['signed'])->group(function () {
    Route::get('staff/invitations/{user}', [StaffInvitationController::class, 'show'])
        ->name('staff.invitations.show');
    Route::post('staff/invitations/{user}/accept', [StaffInvitationController::class, 'accept'])
        ->name('staff.invitations.accept');
});

Route::middleware(['auth:sanctum', 'tenant', 'branch'])->group(function () {
    Route::apiResource('staff', StaffController::class)->parameters(['staff' => 'staff'])->names('api.staff');

    Route::patch('staff/{staff}/suspend', [StaffController::class, 'suspend'])->name('api.staff.suspend');
    Route::patch('staff/{staff}/activate', [StaffController::class, 'activate'])->name('api.staff.activate');
    Route::put('staff/{staff}/branches', [StaffController::class, 'assignBranches'])->name('api.staff.branches');
});
