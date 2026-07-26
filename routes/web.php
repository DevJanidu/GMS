<?php

use App\Modules\Gym\Models\GymProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function (Request $request) {
    // Tenant is only resolvable after authentication in this app (no
    // subdomain/host-based tenancy), so the shared login page can't be
    // branded per-tenant. As a stand-in, show whichever tenant has actually
    // uploaded a gym logo — falls back to the generic app brand if none has.
    // Login is the one route every user depends on, so a branding lookup
    // failure (e.g. mid-migration) must never take the page down — fall
    // back to the generic brand instead of a 500.
    $gymProfile = null;

    try {
        $gymProfile = GymProfile::query()->whereNotNull('logo_path')->latest('updated_at')->first();
    } catch (Throwable $e) {
        Log::warning('Unable to resolve gym branding for the login page.', ['exception' => $e]);
    }

    return Inertia::render('auth/login', [
        'canResetPassword' => Features::enabled(Features::resetPasswords()),
        'status' => $request->session()->get('status'),
        'gymName' => $gymProfile?->legal_name,
        'gymLogoUrl' => $gymProfile?->logo_path
            ? Storage::disk('public')->url($gymProfile->logo_path)
            : null,
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
