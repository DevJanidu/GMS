<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Module API Routes
|--------------------------------------------------------------------------
|
| Every module owns its own routes.php. This file only discovers and
| loads them under a common /v1 prefix so no single file needs editing
| when a new module is added.
|
*/

Route::prefix('v1')->group(function () {
    foreach ((glob(app_path('Modules/*/routes.php')) ?: []) as $moduleRoutes) {
        require $moduleRoutes;
    }
});
