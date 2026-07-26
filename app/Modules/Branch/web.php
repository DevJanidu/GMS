<?php

use App\Models\Branch;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified', 'tenant'])->group(function () {
    Route::inertia('branches', 'branches/index')->name('branches.index');
    Route::inertia('branches/create', 'branches/create')->name('branches.create');

    Route::get('branches/{branch}', fn (Branch $branch) => Inertia::render('branches/show', ['branchId' => $branch->id]))
        ->name('branches.show');
    Route::get('branches/{branch}/edit', fn (Branch $branch) => Inertia::render('branches/edit', ['branchId' => $branch->id]))
        ->name('branches.edit');
    Route::get('branches/{branch}/opening-hours', fn (Branch $branch) => Inertia::render('branches/opening-hours', ['branchId' => $branch->id]))
        ->name('branches.opening-hours');
});
