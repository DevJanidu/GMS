<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified', 'tenant'])->group(function () {
    Route::get('exports', fn () => Inertia::render('exports/index'))->name('exports.index');
});
