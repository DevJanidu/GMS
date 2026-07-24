<?php

use App\Modules\Attendance\Controllers\AttendanceCorrectionController;
use App\Modules\Attendance\Controllers\AttendanceMemberSearchController;
use App\Modules\Attendance\Controllers\AttendanceRecordController;
use App\Modules\Attendance\Controllers\AttendanceReversalController;
use App\Modules\Attendance\Controllers\AttendanceScanController;
use App\Modules\Attendance\Controllers\AttendanceSettingsController;
use App\Modules\Attendance\Controllers\LiveAttendanceController;
use App\Modules\Attendance\Controllers\ManualAttendanceController;
use App\Modules\Attendance\Controllers\QrCredentialController;
use App\Modules\Attendance\Middleware\AttendanceScanRateLimit;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'tenant', 'branch'])
    ->prefix('attendance')
    ->name('api.attendance.')
    ->group(function () {
        Route::post('scans', [AttendanceScanController::class, 'store'])
            ->middleware(AttendanceScanRateLimit::class)
            ->name('scans.store');
        Route::get('scans/recent', [AttendanceScanController::class, 'recent'])->name('scans.recent');
        Route::post('manual', [ManualAttendanceController::class, 'store'])->name('manual.store');
        Route::get('members/search', AttendanceMemberSearchController::class)->name('members.search');
        Route::get('live', LiveAttendanceController::class)->name('live.index');
        Route::get('records', [AttendanceRecordController::class, 'index'])->name('records.index');
        Route::get('records/{attendanceRecord}', [AttendanceRecordController::class, 'show'])->name('records.show');
        Route::post('records/{attendanceRecord}/checkout', [AttendanceRecordController::class, 'checkout'])
            ->name('records.checkout');
        Route::post('records/{attendanceRecord}/corrections', [AttendanceCorrectionController::class, 'store'])
            ->name('corrections.store');
        Route::post('records/{attendanceRecord}/reversal', [AttendanceReversalController::class, 'store'])
            ->name('reversals.store');
        Route::get('settings', [AttendanceSettingsController::class, 'show'])->name('settings.show');
        Route::put('settings', [AttendanceSettingsController::class, 'update'])->name('settings.update');
        Route::get('members/{member}/qr', [QrCredentialController::class, 'show'])->name('qr.show');
        Route::post('qr/rotate', [QrCredentialController::class, 'rotate'])->name('qr.rotate');
        Route::delete('members/{member}/qr', [QrCredentialController::class, 'revoke'])->name('qr.revoke');
    });
