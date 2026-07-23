<?php

use App\Modules\Gym\Controllers\GymProfileController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'tenant', 'branch'])->group(function () {
    Route::get('gym/profile', [GymProfileController::class, 'show'])->name('api.gym.profile.show');
    Route::put('gym/profile', [GymProfileController::class, 'update'])->name('api.gym.profile.update');
});
