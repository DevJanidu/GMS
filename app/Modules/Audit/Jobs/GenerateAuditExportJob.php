<?php

namespace App\Modules\Audit\Jobs;

use App\Models\Tenant;
use App\Modules\AccessControl\Models\AuditLog;
use App\Modules\Report\Models\ReportExport;
use Carbon\CarbonImmutable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Storage;
use Throwable;

final class GenerateAuditExportJob implements ShouldQueue
{
    use Queueable;

    public int $tries = 2;

    /** @var list<int> */
    public array $backoff = [30, 180];

    public function __construct(public readonly int $tenantId, public readonly string $exportId) {}

    public function handle(): void
    {
        $export = ReportExport::withoutGlobalScopes()->where('tenant_id', $this->tenantId)->findOrFail($this->exportId);
        $filters = $export->filters ?? [];
        $timezone = Tenant::withoutGlobalScopes()->findOrFail($this->tenantId)->timezone;
        $from = CarbonImmutable::parse($filters['date_from'], $timezone)->startOfDay()->utc();
        $to = CarbonImmutable::parse($filters['date_to'], $timezone)->endOfDay()->utc();
        $export->forceFill(['status' => 'processing', 'started_at' => now()])->save();
        $stream = fopen('php://temp/maxmemory:5242880', 'w+b');
        if ($stream === false) {
            throw new \RuntimeException('Unable to create audit export stream.');
        }
        fputcsv($stream, ['id', 'branch_id', 'actor_id', 'action', 'entity_type', 'entity_id', 'created_at']);
        $count = 0;
        AuditLog::withoutGlobalScopes()->where('tenant_id', $this->tenantId)
            ->where(fn ($q) => $q->whereNull('branch_id')->orWhereIn('branch_id', $filters['_branch_ids'] ?? []))
            ->whereBetween('created_at', [$from, $to])
            ->orderBy('id')->chunkById(500, function ($logs) use ($stream, &$count) {
                foreach ($logs as $log) {
                    fputcsv($stream, [$log->id, $log->branch_id, $log->actor_id, $log->action, $log->auditable_type, $log->entity_identifier, $log->created_at]);
                    $count++;
                }
            });
        rewind($stream);
        $path = "report-exports/{$this->tenantId}/{$export->id}.csv";
        Storage::disk('local')->put($path, $stream);
        fclose($stream);
        $export->forceFill([
            'status' => 'completed', 'disk' => 'local', 'file_path' => $path,
            'row_count' => $count, 'completed_at' => now(), 'expires_at' => now()->addDays(7),
        ])->save();
    }

    public function failed(?Throwable $exception): void
    {
        ReportExport::withoutGlobalScopes()->where('tenant_id', $this->tenantId)->whereKey($this->exportId)
            ->update([
                'status' => 'failed',
                'failure_reason' => 'audit_export_generation_failed',
                'expires_at' => now()->addDays(7),
            ]);
    }
}
