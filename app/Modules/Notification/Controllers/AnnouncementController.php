<?php

namespace App\Modules\Notification\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\AccessControl\Services\AuditLogger;
use App\Modules\Notification\Jobs\DispatchAnnouncementJob;
use App\Modules\Notification\Models\Announcement;
use App\Modules\Notification\Models\NotificationTemplate;
use App\Modules\Notification\Requests\StoreAnnouncementRequest;
use App\Modules\Notification\Services\NotificationAuthorizer;
use App\Shared\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class AnnouncementController extends Controller
{
    public function index(Request $request, NotificationAuthorizer $authorizer): JsonResponse
    {
        $branchId = $request->integer('branch_id') ?: null;
        $authorizer->authorize($request->user(), 'notifications.announcements.view', $branchId);

        return ApiResponse::paginated(Announcement::query()
            ->when($branchId, fn ($query, $id) => $query->where('branch_id', $id))
            ->latest()
            ->paginate(min(max($request->integer('per_page', 20), 1), 100)));
    }

    public function store(StoreAnnouncementRequest $request, NotificationAuthorizer $authorizer, AuditLogger $audit): JsonResponse
    {
        $data = $request->validated();
        $authorizer->authorize($request->user(), 'notifications.announcements.create', $data['branch_id'] ?? null);
        $authorizer->authorize($request->user(), 'notifications.announcements.create', $data['audience_filters']['branch_id'] ?? null);
        $this->assertTemplate($data['template_id'], $request->user()->tenant_id, $data['channels']);
        $announcement = Announcement::query()->create($data + ['status' => 'draft', 'created_by' => $request->user()->id]);
        $audit->log($request->user(), 'announcement.created', $announcement, [], [], $announcement->toArray(), [], $announcement->branch_id);

        return ApiResponse::created($announcement->toArray());
    }

    public function show(Announcement $announcement, Request $request, NotificationAuthorizer $authorizer): JsonResponse
    {
        $authorizer->authorize($request->user(), 'notifications.announcements.view', $announcement->branch_id);

        return ApiResponse::success($announcement);
    }

    public function update(StoreAnnouncementRequest $request, Announcement $announcement, NotificationAuthorizer $authorizer, AuditLogger $audit): JsonResponse
    {
        $authorizer->authorize($request->user(), 'notifications.announcements.update', $announcement->branch_id);
        abort_unless($announcement->status === 'draft', 409, 'Only draft announcements can be changed.');
        $data = $request->validated();
        $authorizer->authorize($request->user(), 'notifications.announcements.update', $data['branch_id'] ?? null);
        $authorizer->authorize($request->user(), 'notifications.announcements.update', $data['audience_filters']['branch_id'] ?? null);
        $this->assertTemplate($data['template_id'], $request->user()->tenant_id, $data['channels']);
        $before = $announcement->toArray();
        $announcement->update($data);
        $audit->log($request->user(), 'announcement.updated', $announcement, [], $before, $announcement->toArray(), [], $announcement->branch_id);

        return ApiResponse::success($announcement->fresh());
    }

    public function destroy(Announcement $announcement, Request $request, NotificationAuthorizer $authorizer, AuditLogger $audit): JsonResponse
    {
        $authorizer->authorize($request->user(), 'notifications.announcements.update', $announcement->branch_id);
        abort_unless($announcement->status === 'draft', 409, 'Only draft announcements can be deleted.');
        $audit->log($request->user(), 'announcement.deleted', $announcement, $announcement->toArray(), [], [], [], $announcement->branch_id);
        $announcement->delete();

        return ApiResponse::deleted();
    }

    public function schedule(Announcement $announcement, Request $request, NotificationAuthorizer $authorizer, AuditLogger $audit): JsonResponse
    {
        $authorizer->authorize($request->user(), 'notifications.announcements.dispatch', $announcement->branch_id);
        $scheduledAt = $request->validate(['scheduled_at' => ['nullable', 'date', 'after_or_equal:now']])['scheduled_at']
            ?? $announcement->scheduled_at ?? now();
        DB::transaction(function () use ($announcement, $scheduledAt) {
            $locked = Announcement::query()->lockForUpdate()->findOrFail($announcement->id);
            abort_unless(in_array($locked->status, ['draft', 'scheduled'], true), 409, 'Announcement cannot be scheduled.');
            $locked->forceFill(['status' => 'scheduled', 'scheduled_at' => $scheduledAt])->save();
        });
        DispatchAnnouncementJob::dispatch($announcement->tenant_id, $announcement->id)->delay($scheduledAt);
        $audit->log($request->user(), 'announcement.scheduled', $announcement, ['scheduled_at' => $scheduledAt], [], [], [], $announcement->branch_id);

        return ApiResponse::success($announcement->fresh(), 'Announcement scheduled.');
    }

    public function cancel(Announcement $announcement, Request $request, NotificationAuthorizer $authorizer, AuditLogger $audit): JsonResponse
    {
        $authorizer->authorize($request->user(), 'notifications.announcements.cancel', $announcement->branch_id);
        DB::transaction(function () use ($announcement): void {
            $locked = Announcement::query()->lockForUpdate()->findOrFail($announcement->id);
            abort_unless(in_array($locked->status, ['draft', 'scheduled'], true), 409, 'Dispatched announcements cannot be cancelled.');
            $locked->forceFill(['status' => 'cancelled', 'cancelled_at' => now()])->save();
        });
        $announcement->refresh();
        $audit->log($request->user(), 'announcement.cancelled', $announcement, [], [], [], [], $announcement->branch_id);

        return ApiResponse::success($announcement, 'Announcement cancelled.');
    }

    /** @param list<string> $channels */
    private function assertTemplate(int $templateId, int $tenantId, array $channels): void
    {
        $template = NotificationTemplate::withoutGlobalScopes()->where('tenant_id', $tenantId)->find($templateId);
        if (! $template || ! in_array($template->channel, $channels, true)) {
            throw ValidationException::withMessages(['template_id' => 'The selected template must belong to this gym and match an announcement channel.']);
        }
    }
}
