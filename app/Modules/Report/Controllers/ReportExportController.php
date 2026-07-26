<?php

namespace App\Modules\Report\Controllers;

use App\Enums\MemberStatus;
use App\Http\Controllers\Controller;
use App\Modules\AccessControl\Services\AuditLogger;
use App\Modules\Billing\Enums\PaymentMethod;
use App\Modules\Report\Contracts\ReportQuery;
use App\Modules\Report\Jobs\GenerateReportExportJob;
use App\Modules\Report\Models\ReportExport;
use App\Modules\Report\Services\ReportAuthorizer;
use App\Shared\Support\ApiResponse;
use Carbon\CarbonImmutable;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReportExportController extends Controller
{
    public function index(Request $request, ReportAuthorizer $authorizer): JsonResponse
    {
        $all = $authorizer->can($request->user(), 'exports.view-all');
        $exports = ReportExport::query()
            ->when(! $all, fn ($query) => $query->where('requested_by', $request->user()->id))
            ->latest()->paginate(min(max($request->integer('per_page', 20), 1), 100));

        return ApiResponse::paginated($exports->through(fn (ReportExport $export) => $this->serialize($export)));
    }

    public function store(Request $request, ReportAuthorizer $authorizer, ReportQuery $reports, AuditLogger $audit): JsonResponse
    {
        abort_unless($authorizer->can($request->user(), 'exports.create'), 403);
        $catalogue = collect($reports->catalogue());
        $keys = $catalogue->pluck('key')->all();
        $data = $request->validate([
            'report_key' => ['required', Rule::in($keys)],
            'format' => ['required', Rule::in(['csv'])],
            'date_from' => ['required', 'date'],
            'date_to' => ['required', 'date', 'after_or_equal:date_from'],
            'branch_id' => ['nullable', 'integer'],
            'plan_id' => ['nullable', 'integer'],
            'member_status' => ['nullable', new Enum(MemberStatus::class)],
            'payment_method' => ['nullable', new Enum(PaymentMethod::class)],
        ]);
        abort_if(CarbonImmutable::parse($data['date_from'])->diffInDays(CarbonImmutable::parse($data['date_to'])) > 366, 422, 'The export date range cannot exceed 366 days.');
        $supported = $catalogue->firstWhere('key', $data['report_key'])['filters'] ?? [];
        foreach (['plan_id' => 'plan', 'member_status' => 'member_status', 'payment_method' => 'payment_method'] as $input => $filter) {
            if (isset($data[$input]) && ! in_array($filter, $supported, true)) {
                throw ValidationException::withMessages([
                    $input => 'This filter is not supported by the selected report.',
                ]);
            }
        }
        $authorizer->authorizeReport($request->user(), $data['report_key']);
        $context = $authorizer->context($request->user(), $data['branch_id'] ?? null);
        $filters = $data;
        unset($filters['report_key'], $filters['format']);
        $export = ReportExport::query()->create([
            'branch_id' => $data['branch_id'] ?? null, 'requested_by' => $request->user()->id,
            'report_key' => $data['report_key'], 'format' => 'csv', 'status' => 'queued',
            'filters' => [...$filters, '_branch_ids' => $context->branchIds],
        ]);
        GenerateReportExportJob::dispatch($export->tenant_id, $export->id);
        $audit->log($request->user(), 'report_export.created', $export, ['report_key' => $export->report_key], [], [], [], $export->branch_id);

        return ApiResponse::created($this->serialize($export), 'Report export queued.');
    }

    public function show(ReportExport $reportExport, Request $request, ReportAuthorizer $authorizer): JsonResponse
    {
        $this->authorizeOwned($request, $reportExport, $authorizer, 'exports.view-all');

        return ApiResponse::success($this->serialize($reportExport));
    }

    public function download(ReportExport $reportExport, Request $request, ReportAuthorizer $authorizer, AuditLogger $audit): StreamedResponse
    {
        $this->authorizeOwned($request, $reportExport, $authorizer, 'exports.download-all');
        abort_unless($reportExport->status === 'completed' && $reportExport->expires_at?->isFuture(), 410, 'This export is not available.');
        abort_unless($reportExport->disk && $reportExport->file_path && Storage::disk($reportExport->disk)->exists($reportExport->file_path), 404);
        $reportExport->forceFill(['downloaded_at' => now()])->save();
        $audit->log($request->user(), 'report_export.downloaded', $reportExport, [], [], [], [], $reportExport->branch_id);

        return Storage::disk($reportExport->disk)->download(
            $reportExport->file_path,
            $reportExport->report_key.'-'.$reportExport->id.'.csv',
            ['Content-Type' => 'text/csv; charset=UTF-8', 'Cache-Control' => 'private, no-store'],
        );
    }

    public function retry(ReportExport $reportExport, Request $request, ReportAuthorizer $authorizer, AuditLogger $audit): JsonResponse
    {
        $this->authorizeOwned($request, $reportExport, $authorizer, 'exports.manage');
        abort_unless($reportExport->status === 'failed', 409, 'Only failed exports can be retried.');
        $reportExport->forceFill([
            'status' => 'queued',
            'failure_reason' => null,
            'started_at' => null,
            'expires_at' => null,
        ])->save();
        GenerateReportExportJob::dispatch($reportExport->tenant_id, $reportExport->id);
        $audit->log($request->user(), 'report_export.retried', $reportExport, [], [], [], [], $reportExport->branch_id);

        return ApiResponse::success($this->serialize($reportExport), 'Export retry queued.');
    }

    private function authorizeOwned(Request $request, ReportExport $export, ReportAuthorizer $authorizer, string $allPermission): void
    {
        $context = $authorizer->context($request->user(), $export->branch_id);
        abort_unless(in_array($export->branch_id, $context->branchIds, true) || $export->branch_id === null, 403);
        abort_unless($export->requested_by === $request->user()->id || $authorizer->can($request->user(), $allPermission), 403);
    }

    /** @return array<string, mixed> */
    private function serialize(ReportExport $export): array
    {
        $filters = $export->filters ?? [];
        unset($filters['_branch_ids']);

        $ready = $export->status === 'completed';

        return [
            'id' => $export->id, 'branch_id' => $export->branch_id,
            'requested_by' => $export->requested_by, 'report_key' => $export->report_key,
            'format' => $export->format, 'status' => $export->status, 'filters' => $filters,
            'row_count' => $export->row_count, 'started_at' => $export->started_at,
            'completed_at' => $export->completed_at, 'expires_at' => $export->expires_at,
            'downloaded_at' => $export->downloaded_at, 'failure_reason' => $export->failure_reason,
            'created_at' => $export->created_at,
            'file_name' => $ready ? $export->report_key.'-'.$export->id.'.csv' : null,
            'download_url' => $ready ? route('api.report-exports.download', $export) : null,
        ];
    }
}
