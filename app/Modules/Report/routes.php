<?php

use App\Modules\Report\Controllers\ReportController;
use App\Modules\Report\Controllers\ReportExportController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'tenant'])->group(function () {
    Route::get('reports/catalogue', [ReportController::class, 'catalogue'])->name('api.reports.catalogue');
    Route::get('reports/dashboard/operational', [ReportController::class, 'operational'])->name('api.reports.dashboard.operational');
    Route::get('reports/{reportKey}/print', [ReportController::class, 'print'])->name('api.reports.print');
    Route::get('reports/{reportKey}', [ReportController::class, 'show'])->name('api.reports.show');

    Route::post('report-exports', [ReportExportController::class, 'store'])->name('api.report-exports.store');
    Route::get('report-exports', [ReportExportController::class, 'index'])->name('api.report-exports.index');
    Route::get('report-exports/{reportExport}', [ReportExportController::class, 'show'])->name('api.report-exports.show');
    Route::get('report-exports/{reportExport}/download', [ReportExportController::class, 'download'])->name('api.report-exports.download');
    Route::post('report-exports/{reportExport}/retry', [ReportExportController::class, 'retry'])->name('api.report-exports.retry');
});
