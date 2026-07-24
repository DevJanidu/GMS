<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified', 'tenant'])->prefix('notifications')->name('notifications.')->group(function () {
    Route::get('/', fn () => Inertia::render('notifications/member-notifications/index'))->name('index');
    Route::get('templates', fn () => Inertia::render('notifications/templates/index'))->name('templates.index');
    Route::get('templates/create', fn () => Inertia::render('notifications/templates/create'))->name('templates.create');
    Route::get('templates/{templateId}/edit', fn (int $templateId) => Inertia::render('notifications/templates/edit', ['templateId' => $templateId]))->name('templates.edit');
    Route::get('rules', fn () => Inertia::render('notifications/rules/index'))->name('rules.index');
    Route::get('logs', fn () => Inertia::render('notifications/logs/index'))->name('logs.index');
    Route::get('announcements', fn () => Inertia::render('notifications/announcements/index'))->name('announcements.index');
});
