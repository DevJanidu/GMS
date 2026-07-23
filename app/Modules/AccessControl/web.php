<?php

use App\Models\Role;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified', 'tenant'])->group(function () {
    Route::inertia('roles', 'roles/index')->name('roles.index');
    Route::inertia('roles/create', 'roles/create')->name('roles.create');

    Route::get('roles/{role}/edit', fn (Role $role) => Inertia::render('roles/edit', ['roleId' => $role->id]))
        ->name('roles.edit');
});
