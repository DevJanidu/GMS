<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified', 'tenant', 'branch'])
    ->prefix('reports')
    ->name('reports.')
    ->group(function () {
        Route::inertia('/', 'reports/index')->name('index');
        Route::get('/{key}', fn (string $key) => Inertia::render('reports/show', ['reportKey' => $key]))
            ->name('show');
    });
