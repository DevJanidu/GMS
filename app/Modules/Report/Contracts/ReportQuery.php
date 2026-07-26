<?php

namespace App\Modules\Report\Contracts;

use App\Modules\Report\DTOs\ReportContext;
use App\Modules\Report\DTOs\ReportFilters;

interface ReportQuery
{
    /** @return array<string, mixed> */
    public function run(string $reportKey, ReportContext $context, ReportFilters $filters): array;

    /** @return list<array<string, mixed>> */
    public function catalogue(): array;
}
