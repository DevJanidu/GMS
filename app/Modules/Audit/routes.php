<?php

use App\Modules\Audit\Controllers\AuditLogController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'tenant'])->group(function () {
    Route::get('audit-logs', [AuditLogController::class, 'index'])->name('api.audit-logs.index');
    Route::post('audit-logs/exports', [AuditLogController::class, 'export'])->name('api.audit-logs.exports.store');
    Route::get('audit-logs/{auditLog}', [AuditLogController::class, 'show'])->name('api.audit-logs.show');
});
