<?php

use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use App\Tenancy\Middleware\IdentifyTenant;
use App\Tenancy\Middleware\SetBranchContext;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Http\Request;
use Illuminate\Routing\Middleware\SubstituteBindings;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        // Without this, routes/api.php (and every module's routes.php it
        // loads) is never registered at all — every /api/v1/* endpoint
        // 404s, including on a fresh checkout with no route cache to mask
        // it. `api:` here applies the framework's default `api` middleware
        // group and `/api` prefix, combining with the `Route::prefix('v1')`
        // already inside routes/api.php to give the `/api/v1/...` paths
        // every module (and the frontend API client) already assumes.
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        // Every module's frontend API client (resources/js/lib/api/client.ts)
        // authenticates via the session cookie + XSRF header, not a bearer
        // token — `auth:sanctum` on api.php only accepts that for requests
        // Sanctum recognizes as coming from the SPA itself. Without this,
        // every /api/v1/* route 401s for the browser even with a valid
        // logged-in session (confirmed manually: the `dashboard` Inertia
        // page authenticates fine, but /api/v1/dashboard/summary didn't,
        // until this was added).
        $middleware->statefulApi();

        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->alias([
            'tenant' => IdentifyTenant::class,
            'branch' => SetBranchContext::class,
        ]);

        // Route model binding (SubstituteBindings) must run after the tenant
        // is identified, otherwise a tenant-scoped model can be resolved by
        // ID alone before the tenant global scope is bound, letting a bound
        // route parameter leak a record that belongs to another tenant.
        $middleware->prependToPriorityList(
            before: SubstituteBindings::class,
            prepend: IdentifyTenant::class,
        );

        $middleware->prependToPriorityList(
            before: SubstituteBindings::class,
            prepend: SetBranchContext::class,
        );
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );
    })->create();
