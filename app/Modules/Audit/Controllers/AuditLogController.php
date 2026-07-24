<?php

namespace App\Modules\Audit\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\AccessControl\Models\AuditLog;
use App\Modules\AccessControl\Services\AuditLogger;
use App\Modules\Audit\Jobs\GenerateAuditExportJob;
use App\Modules\Audit\Services\AuditAuthorizer;
use App\Modules\Report\Models\ReportExport;
use App\Shared\Support\ApiResponse;
use Carbon\CarbonImmutable;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuditLogController extends Controller
{
    public function index(Request $request, AuditAuthorizer $authorizer): JsonResponse
    {
        $branches = $authorizer->branches($request->user(), 'audit.view');
        $validated = validator($request->all(), [
            'actor_id' => ['nullable', 'integer'], 'action' => ['nullable', 'string', 'max:120'],
            'entity_type' => ['nullable', 'string', 'max:255'], 'entity_id' => ['nullable', 'string', 'max:255'],
            'branch_id' => ['nullable', 'integer'], 'date_from' => ['nullable', 'date'],
            'date_to' => ['nullable', 'date', 'after_or_equal:date_from'],
            'support_access' => ['nullable', 'boolean'], 'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ])->validate();
        if (isset($validated['branch_id'])) {
            abort_unless(in_array((int) $validated['branch_id'], $branches, true), 403);
            $branches = [(int) $validated['branch_id']];
        }

        $logs = AuditLog::query()
            ->where(fn ($q) => $q->whereNull('branch_id')->orWhereIn('branch_id', $branches))
            ->when($validated['actor_id'] ?? null, fn ($q, $id) => $q->where('actor_id', $id))
            ->when($validated['action'] ?? null, fn ($q, $action) => $q->where('action', 'like', $action.'%'))
            ->when($validated['entity_type'] ?? null, fn ($q, $type) => $q->where('auditable_type', $type))
            ->when($validated['entity_id'] ?? null, fn ($q, $id) => $q->where('entity_identifier', $id))
            ->when($validated['date_from'] ?? null, fn ($q, $date) => $q->where('created_at', '>=', $date))
            ->when($validated['date_to'] ?? null, fn ($q, $date) => $q->where('created_at', '<=', $date.' 23:59:59'))
            ->when(array_key_exists('support_access', $validated), fn ($q) => $q->where('context->support_access', (bool) $validated['support_access']))
            ->with(['actor:id,name,email', 'branch:id,name'])
            ->latest()->paginate(min(max($request->integer('per_page', 20), 1), 100));

        return ApiResponse::paginated($logs->through(fn (AuditLog $log) => $this->serialize($log)));
    }

    public function show(AuditLog $auditLog, Request $request, AuditAuthorizer $authorizer): JsonResponse
    {
        $branches = $authorizer->branches($request->user(), 'audit.view');
        abort_unless($auditLog->branch_id === null || in_array($auditLog->branch_id, $branches, true), 404);

        return ApiResponse::success($this->serialize($auditLog->load(['actor:id,name,email', 'branch:id,name'])));
    }

    public function export(Request $request, AuditAuthorizer $authorizer, AuditLogger $audit): JsonResponse
    {
        $branches = $authorizer->branches($request->user(), 'audit.export');
        $data = $request->validate([
            'date_from' => ['required', 'date'], 'date_to' => ['required', 'date', 'after_or_equal:date_from'],
            'branch_id' => ['nullable', 'integer'],
        ]);
        abort_if(
            CarbonImmutable::parse($data['date_from'])->diffInDays(CarbonImmutable::parse($data['date_to'])) > 366,
            422,
            'The audit export date range cannot exceed 366 days.',
        );
        if (isset($data['branch_id'])) {
            abort_unless(in_array((int) $data['branch_id'], $branches, true), 403);
            $branches = [(int) $data['branch_id']];
        }
        $export = ReportExport::query()->create([
            'branch_id' => $data['branch_id'] ?? null, 'requested_by' => $request->user()->id,
            'report_key' => 'audit-logs', 'format' => 'csv', 'status' => 'queued',
            'filters' => [...$data, '_branch_ids' => $branches],
        ]);
        GenerateAuditExportJob::dispatch($export->tenant_id, $export->id);
        $audit->log($request->user(), 'audit_export.created', $export, ['filters' => $data], [], [], [], $export->branch_id);

        return ApiResponse::created(['id' => $export->id, 'status' => $export->status], 'Audit export queued.');
    }

    /** @return array<string, mixed> */
    private function serialize(AuditLog $log): array
    {
        return [
            'id' => $log->id, 'branch_id' => $log->branch_id, 'actor_id' => $log->actor_id,
            'actor' => $log->relationLoaded('actor') ? $log->actor?->only(['id', 'name', 'email']) : null,
            'action' => $log->action, 'entity_type' => $log->auditable_type,
            'entity_id' => $log->entity_identifier ?: (string) $log->auditable_id,
            'changes' => $log->changes ?? [], 'before_values' => $log->before_values ?? [],
            'after_values' => $log->after_values ?? [], 'context' => $log->context ?? [],
            'request_id' => $log->request_id, 'ip_address' => $log->ip_address,
            'user_agent' => $log->user_agent, 'created_at' => $log->created_at,
        ];
    }
}
