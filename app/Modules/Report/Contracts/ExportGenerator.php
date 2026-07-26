<?php

namespace App\Modules\Report\Contracts;

use App\Modules\Report\Models\ReportExport;

interface ExportGenerator
{
    public function generate(ReportExport $export): int;
}
