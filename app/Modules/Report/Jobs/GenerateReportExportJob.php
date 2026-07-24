<?php

namespace App\Modules\Report\Jobs;

use App\Modules\Report\Contracts\ExportGenerator;
use App\Modules\Report\Models\ReportExport;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Throwable;

final class GenerateReportExportJob implements ShouldQueue
{
    use Queueable;

    public int $tries = 2;

    /** @var list<int> */
    public array $backoff = [30, 180];

    public function __construct(public readonly int $tenantId, public readonly string $exportId) {}

    public function handle(ExportGenerator $generator): void
    {
        $export = ReportExport::withoutGlobalScopes()
            ->where('tenant_id', $this->tenantId)->findOrFail($this->exportId);
        if ($export->status === 'completed' || $export->status === 'expired') {
            return;
        }

        $export->forceFill(['status' => 'processing', 'started_at' => now(), 'failure_reason' => null])->save();
        $rowCount = $generator->generate($export);
        $export->forceFill([
            'status' => 'completed', 'row_count' => $rowCount,
            'completed_at' => now(), 'expires_at' => now()->addDays(7),
        ])->save();
    }

    public function failed(?Throwable $exception): void
    {
        ReportExport::withoutGlobalScopes()
            ->where('tenant_id', $this->tenantId)->whereKey($this->exportId)
            ->whereNotIn('status', ['completed', 'expired'])
            ->update([
                'status' => 'failed',
                'failure_reason' => 'export_generation_failed',
                'expires_at' => now()->addDays(7),
            ]);
    }
}
