<?php

use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';

foreach ((glob(app_path('Modules/*/web.php')) ?: []) as $moduleWebRoutes) {
    require $moduleWebRoutes;
}
