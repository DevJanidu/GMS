<?php

use App\Modules\Branch\Controllers\BranchController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'tenant', 'branch'])->group(function () {
    Route::apiResource('branches', BranchController::class)->names('api.branches');

    Route::put('branches/{branch}/opening-hours', [BranchController::class, 'updateOpeningHours'])
        ->name('api.branches.opening-hours');
});
