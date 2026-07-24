<?php

namespace App\Modules\Report\Console\Commands;

use App\Modules\Report\Models\ReportExport;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class ExpireReportExportsCommand extends Command
{
    protected $signature = 'reports:expire-exports';

    protected $description = 'Expire report exports and remove their private files';

    public function handle(): int
    {
        ReportExport::withoutGlobalScopes()
            ->whereIn('status', ['completed', 'failed'])
            ->whereNotNull('expires_at')->where('expires_at', '<=', now())
            ->chunkById(100, function ($exports) {
                foreach ($exports as $export) {
                    if ($export->disk && $export->file_path) {
                        Storage::disk($export->disk)->delete($export->file_path);
                    }
                    $export->forceFill(['status' => 'expired', 'disk' => null, 'file_path' => null])->save();
                }
            }, 'id');

        return self::SUCCESS;
    }
}
