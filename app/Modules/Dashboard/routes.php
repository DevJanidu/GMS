<?php

use App\Modules\Dashboard\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'tenant'])
    ->prefix('dashboard')
    ->name('api.dashboard.')
    ->group(function () {
        Route::get('summary', [DashboardController::class, 'summary'])->name('summary');
        Route::get('filters', [DashboardController::class, 'filters'])->name('filters');
    });
