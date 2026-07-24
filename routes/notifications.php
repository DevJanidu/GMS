<?php

use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'tenant'])
    ->group(function () {
        Route::inertia('notifications', 'notifications/member-notifications/index')->name('notifications.center');
    });
