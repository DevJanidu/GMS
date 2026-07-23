<?php

use App\Models\User;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified', 'tenant'])->group(function () {
    Route::inertia('staff', 'staff/index')->name('staff.index');
    Route::inertia('staff/create', 'staff/create')->name('staff.create');

    Route::get('staff/{staff}', fn (User $staff) => Inertia::render('staff/show', ['staffId' => $staff->id]))
        ->name('staff.show');
    Route::get('staff/{staff}/edit', fn (User $staff) => Inertia::render('staff/edit', ['staffId' => $staff->id]))
        ->name('staff.edit');
    Route::get('staff/{staff}/branches', fn (User $staff) => Inertia::render('staff/branches', ['staffId' => $staff->id]))
        ->name('staff.branches');
});

Route::get('staff/invitations/{user}/accept', fn (User $user) => Inertia::render('staff/accept-invitation', ['userId' => $user->id]))
    ->name('staff.invitations.accept-page');
