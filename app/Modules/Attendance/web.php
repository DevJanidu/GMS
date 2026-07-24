<?php

use App\Tenancy\Services\BranchContext;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified', 'tenant', 'branch'])
    ->prefix('attendance')
    ->name('attendance.')
    ->group(function () {
        Route::get('scanner', fn (BranchContext $branch) => Inertia::render(
            'attendance/scanner',
            ['branchId' => $branch->id()],
        ))->name('scanner');
        Route::get('manual', fn () => Inertia::render('attendance/manual'))->name('manual');
        Route::get('live', fn () => Inertia::render('attendance/live'))->name('live');
        Route::get('history', fn () => Inertia::render('attendance/history'))->name('history');
        Route::get('records/{attendanceRecordId}', fn (int $attendanceRecordId) => Inertia::render(
            'attendance/details',
            ['attendanceRecordId' => $attendanceRecordId],
        ))->name('records.show');
        Route::get('records/{attendanceRecordId}/correct', fn (int $attendanceRecordId) => Inertia::render(
            'attendance/correct',
            ['attendanceRecordId' => $attendanceRecordId],
        ))->name('corrections.create');
        Route::get('settings', fn () => Inertia::render('attendance/settings'))->name('settings');
    });
