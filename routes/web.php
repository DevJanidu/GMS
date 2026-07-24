<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function (Request $request) {
    return Inertia::render('auth/login', [
        'canResetPassword' => Features::enabled(Features::resetPasswords()),
        'status' => $request->session()->get('status'),
    ]);
})->middleware('guest')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/members.php';
require __DIR__.'/plans.php';
require __DIR__.'/reports.php';
require __DIR__.'/notifications.php';

foreach ((glob(app_path('Modules/*/web.php')) ?: []) as $moduleWebRoutes) {
    require $moduleWebRoutes;
}
