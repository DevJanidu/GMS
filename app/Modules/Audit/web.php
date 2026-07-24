<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified', 'tenant'])->prefix('audit')->name('audit.')->group(function () {
    Route::get('/', fn () => Inertia::render('audit/index'))->name('index');
    Route::get('{auditLogId}', fn (int $auditLogId) => Inertia::render('audit/show', ['auditLogId' => $auditLogId]))->name('show');
});
