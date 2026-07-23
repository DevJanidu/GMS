<?php

use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'tenant'])->group(function () {
    Route::inertia('settings/gym', 'settings/gym')->name('settings.gym');
});
