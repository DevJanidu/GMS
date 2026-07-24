<?php

namespace App\Modules\Notification\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\AccessControl\Services\AuditLogger;
use App\Modules\Notification\Contracts\NotificationTemplateRenderer;
use App\Modules\Notification\Models\NotificationTemplate;
use App\Modules\Notification\Requests\StoreNotificationTemplateRequest;
use App\Modules\Notification\Services\NotificationAuthorizer;
use App\Shared\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationTemplateController extends Controller
{
    public function index(Request $request, NotificationAuthorizer $authorizer): JsonResponse
    {
        $branchId = $request->integer('branch_id') ?: null;
        $authorizer->authorize($request->user(), 'notifications.templates.view', $branchId);
        $templates = NotificationTemplate::query()
            ->when($branchId, fn ($query, $id) => $query->where('branch_id', $id))
            ->orderBy('name')
            ->paginate(min(max($request->integer('per_page', 20), 1), 100));

        return ApiResponse::paginated($templates);
    }

    public function store(
        StoreNotificationTemplateRequest $request,
        NotificationAuthorizer $authorizer,
        AuditLogger $audit,
    ): JsonResponse {
        $data = $request->validated();
        $authorizer->authorize($request->user(), 'notifications.templates.create', $data['branch_id'] ?? null);
        $template = NotificationTemplate::query()->create($data + ['created_by' => $request->user()->id]);
        $audit->log($request->user(), 'notification_template.created', $template, [], [], $template->toArray(), [], $template->branch_id);

        return ApiResponse::created($template->toArray());
    }

    public function show(NotificationTemplate $notificationTemplate, Request $request, NotificationAuthorizer $authorizer): JsonResponse
    {
        $authorizer->authorize($request->user(), 'notifications.templates.view', $notificationTemplate->branch_id);

        return ApiResponse::success($notificationTemplate);
    }

    public function update(
        StoreNotificationTemplateRequest $request,
        NotificationTemplate $notificationTemplate,
        NotificationAuthorizer $authorizer,
        AuditLogger $audit,
    ): JsonResponse {
        $authorizer->authorize($request->user(), 'notifications.templates.update', $notificationTemplate->branch_id);
        $authorizer->authorize($request->user(), 'notifications.templates.update', $request->integer('branch_id') ?: null);
        $before = $notificationTemplate->toArray();
        $notificationTemplate->update($request->validated());
        $audit->log($request->user(), 'notification_template.updated', $notificationTemplate, [], $before, $notificationTemplate->toArray(), [], $notificationTemplate->branch_id);

        return ApiResponse::success($notificationTemplate->fresh(), 'Notification template updated.');
    }

    public function destroy(NotificationTemplate $notificationTemplate, Request $request, NotificationAuthorizer $authorizer, AuditLogger $audit): JsonResponse
    {
        $authorizer->authorize($request->user(), 'notifications.templates.delete', $notificationTemplate->branch_id);
        $audit->log($request->user(), 'notification_template.deleted', $notificationTemplate, $notificationTemplate->toArray(), [], [], [], $notificationTemplate->branch_id);
        $notificationTemplate->delete();

        return ApiResponse::deleted();
    }

    public function preview(
        NotificationTemplate $notificationTemplate,
        Request $request,
        NotificationAuthorizer $authorizer,
        NotificationTemplateRenderer $renderer,
    ): JsonResponse {
        $authorizer->authorize($request->user(), 'notifications.templates.view', $notificationTemplate->branch_id);
        $variables = $request->validate(['variables' => ['nullable', 'array']])['variables'] ?? [];

        return ApiResponse::success((array) $renderer->render($notificationTemplate, $variables));
    }
}
