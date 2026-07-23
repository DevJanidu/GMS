<?php

use App\Http\Controllers\PlanCloneController;
use App\Http\Controllers\PlanController;
use App\Http\Controllers\PlanStatusController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'tenant', 'branch'])
    ->prefix('plans')
    ->name('plans.')
    ->group(function () {
        Route::get('/', [PlanController::class, 'index'])->name('index');
        Route::get('/create', [PlanController::class, 'create'])->name('create');
        Route::post('/', [PlanController::class, 'store'])->name('store');
        Route::get('/{plan}', [PlanController::class, 'show'])->name('show');
        Route::get('/{plan}/edit', [PlanController::class, 'edit'])->name('edit');
        Route::put('/{plan}', [PlanController::class, 'update'])->name('update');
        Route::patch('/{plan}/status', [PlanStatusController::class, 'update'])->name('status.update');
        Route::post('/{plan}/clone', [PlanCloneController::class, 'store'])->name('clone');
    });
