<?php

namespace App\Modules\Report\Services;

use App\Models\Tenant;
use App\Modules\Report\Contracts\ExportGenerator;
use App\Modules\Report\Contracts\ReportQuery;
use App\Modules\Report\DTOs\ReportContext;
use App\Modules\Report\DTOs\ReportFilters;
use App\Modules\Report\Models\ReportExport;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Storage;
use RuntimeException;

final class CsvExportGenerator implements ExportGenerator
{
    public function __construct(private readonly ReportQuery $reports) {}

    public function generate(ReportExport $export): int
    {
        $filters = $export->filters ?? [];
        $tenant = Tenant::query()->findOrFail($export->tenant_id);
        $context = new ReportContext(
            $export->tenant_id,
            (int) $export->requested_by,
            array_map('intval', $filters['_branch_ids'] ?? array_filter([$export->branch_id])),
            $tenant->timezone,
            $tenant->currency,
        );
        $page = 1;
        $rowsWritten = 0;
        $stream = fopen('php://temp/maxmemory:5242880', 'w+b');
        if ($stream === false) {
            throw new RuntimeException('Unable to create export stream.');
        }

        $headersWritten = false;
        do {
            $reportFilters = new ReportFilters(
                CarbonImmutable::parse($filters['date_from']),
                CarbonImmutable::parse($filters['date_to']),
                $filters['branch_id'] ?? null,
                $filters['plan_id'] ?? null,
                $filters['member_status'] ?? null,
                $filters['payment_method'] ?? null,
                $page,
                100,
            );
            $result = $this->reports->run($export->report_key, $context, $reportFilters);
            $rows = $result['rows'];

            foreach ($rows as $row) {
                if (! $headersWritten) {
                    fputcsv($stream, array_keys($row));
                    $headersWritten = true;
                }
                fputcsv($stream, array_map(
                    fn ($value) => is_array($value) ? json_encode($value, JSON_THROW_ON_ERROR) : $value,
                    $row,
                ));
                $rowsWritten++;
            }
            $page++;
        } while ($rows !== [] && $page <= (int) $result['meta']['last_page']);

        if (! $headersWritten) {
            fputcsv($stream, ['no_data']);
        }

        rewind($stream);
        $path = "report-exports/{$export->tenant_id}/{$export->id}.csv";
        if (! Storage::disk('local')->put($path, $stream)) {
            fclose($stream);
            throw new RuntimeException('Unable to store report export.');
        }
        fclose($stream);

        $export->forceFill(['disk' => 'local', 'file_path' => $path])->save();

        return $rowsWritten;
    }
}
