<?php

use App\Modules\AccessControl\Controllers\PermissionController;
use App\Modules\AccessControl\Controllers\RoleController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'tenant', 'branch'])->group(function () {
    Route::get('permissions', [PermissionController::class, 'index'])->name('api.permissions.index');

    Route::apiResource('roles', RoleController::class)->names('api.roles');
});
