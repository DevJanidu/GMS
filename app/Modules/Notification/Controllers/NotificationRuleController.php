<?php

namespace App\Modules\Notification\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\AccessControl\Services\AuditLogger;
use App\Modules\Notification\Models\NotificationRule;
use App\Modules\Notification\Models\NotificationTemplate;
use App\Modules\Notification\Requests\StoreNotificationRuleRequest;
use App\Modules\Notification\Services\NotificationAuthorizer;
use App\Shared\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class NotificationRuleController extends Controller
{
    public function index(Request $request, NotificationAuthorizer $authorizer): JsonResponse
    {
        $branchId = $request->integer('branch_id') ?: null;
        $authorizer->authorize($request->user(), 'notifications.rules.view', $branchId);
        $rules = NotificationRule::query()
            ->when($branchId, fn ($query, $id) => $query->where('branch_id', $id))
            ->with('template')->orderBy('name')
            ->paginate(min(max($request->integer('per_page', 20), 1), 100));

        return ApiResponse::paginated($rules);
    }

    public function store(StoreNotificationRuleRequest $request, NotificationAuthorizer $authorizer, AuditLogger $audit): JsonResponse
    {
        $data = $request->validated();
        $authorizer->authorize($request->user(), 'notifications.rules.create', $data['branch_id'] ?? null);
        $this->assertTemplate($data, $request->user()->tenant_id);
        $rule = NotificationRule::query()->create($data + ['created_by' => $request->user()->id]);
        $audit->log($request->user(), 'notification_rule.created', $rule, [], [], $rule->toArray(), [], $rule->branch_id);

        return ApiResponse::created($rule->load('template')->toArray());
    }

    public function show(NotificationRule $notificationRule, Request $request, NotificationAuthorizer $authorizer): JsonResponse
    {
        $authorizer->authorize($request->user(), 'notifications.rules.view', $notificationRule->branch_id);

        return ApiResponse::success($notificationRule->load('template'));
    }

    public function update(StoreNotificationRuleRequest $request, NotificationRule $notificationRule, NotificationAuthorizer $authorizer, AuditLogger $audit): JsonResponse
    {
        $authorizer->authorize($request->user(), 'notifications.rules.update', $notificationRule->branch_id);
        $data = $request->validated();
        $authorizer->authorize($request->user(), 'notifications.rules.update', $data['branch_id'] ?? null);
        $this->assertTemplate($data, $request->user()->tenant_id);
        $before = $notificationRule->toArray();
        $notificationRule->update($data);
        $audit->log($request->user(), 'notification_rule.updated', $notificationRule, [], $before, $notificationRule->toArray(), [], $notificationRule->branch_id);

        return ApiResponse::success($notificationRule->fresh('template'), 'Notification rule updated.');
    }

    public function destroy(NotificationRule $notificationRule, Request $request, NotificationAuthorizer $authorizer, AuditLogger $audit): JsonResponse
    {
        $authorizer->authorize($request->user(), 'notifications.rules.delete', $notificationRule->branch_id);
        $audit->log($request->user(), 'notification_rule.deleted', $notificationRule, $notificationRule->toArray(), [], [], [], $notificationRule->branch_id);
        $notificationRule->delete();

        return ApiResponse::deleted();
    }

    /** @param array<string, mixed> $data */
    private function assertTemplate(array $data, int $tenantId): void
    {
        $template = NotificationTemplate::withoutGlobalScopes()
            ->where('tenant_id', $tenantId)->find((int) $data['template_id']);
        if (! $template || $template->channel !== $data['channel']) {
            throw ValidationException::withMessages(['template_id' => 'The template must belong to this gym and match the rule channel.']);
        }
    }
}
