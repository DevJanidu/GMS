<?php

namespace App\Modules\Report\Providers;

use App\Modules\Report\Console\Commands\ExpireReportExportsCommand;
use App\Modules\Report\Contracts\ExportGenerator;
use App\Modules\Report\Contracts\ReportQuery;
use App\Modules\Report\Services\CsvExportGenerator;
use App\Modules\Report\Services\DatabaseReportQuery;
use Illuminate\Support\ServiceProvider;

class ReportServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(ReportQuery::class, DatabaseReportQuery::class);
        $this->app->bind(ExportGenerator::class, CsvExportGenerator::class);
    }

    public function boot(): void
    {
        if ($this->app->runningInConsole()) {
            $this->commands([ExpireReportExportsCommand::class]);
        }
    }
}
