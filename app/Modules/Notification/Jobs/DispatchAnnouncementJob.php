<?php

namespace App\Modules\Notification\Jobs;

use App\Models\Member;
use App\Modules\Membership\Models\Membership;
use App\Modules\Notification\Models\Announcement;
use App\Modules\Notification\Models\NotificationTemplate;
use App\Modules\Notification\Services\DatabaseNotificationDispatcher;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\DB;

final class DispatchAnnouncementJob implements ShouldQueue
{
    use InteractsWithQueue, Queueable;

    public int $tries = 2;

    public function __construct(public readonly int $tenantId, public readonly int $announcementId) {}

    public function handle(DatabaseNotificationDispatcher $dispatcher): void
    {
        $scheduled = Announcement::withoutGlobalScopes()
            ->where('tenant_id', $this->tenantId)
            ->findOrFail($this->announcementId);
        if ($scheduled->scheduled_at?->isFuture()) {
            $this->release(max(1, (int) now()->diffInSeconds($scheduled->scheduled_at)));

            return;
        }

        $announcement = DB::transaction(function () {
            $announcement = Announcement::withoutGlobalScopes()
                ->where('tenant_id', $this->tenantId)
                ->lockForUpdate()
                ->findOrFail($this->announcementId);

            if ($announcement->status === 'cancelled' || $announcement->dispatched_at !== null) {
                return null;
            }
            if ($announcement->status !== 'scheduled') {
                return null;
            }

            $announcement->forceFill(['status' => 'dispatching'])->save();

            return $announcement;
        });

        if (! $announcement) {
            return;
        }

        $template = NotificationTemplate::withoutGlobalScopes()
            ->where('tenant_id', $this->tenantId)
            ->findOrFail($announcement->template_id);
        $filters = $announcement->audience_filters ?? [];
        $query = Member::withoutGlobalScopes()
            ->where('tenant_id', $this->tenantId)
            ->when($filters['branch_id'] ?? $announcement->branch_id, fn ($q, $id) => $q->where('branch_id', $id))
            ->when($filters['member_status'] ?? null, fn ($q, $status) => $q->where('status', $status));

        if (isset($filters['plan_id'])) {
            $memberIds = Membership::withoutGlobalScopes()
                ->where('tenant_id', $this->tenantId)
                ->where('plan_id', $filters['plan_id'])
                ->pluck('member_id');
            $query->whereIn('id', $memberIds);
        }

        $query->orderBy('id')->chunkById(100, function ($members) use ($announcement, $dispatcher, $template) {
            foreach ($members as $member) {
                foreach ($announcement->channels as $channel) {
                    $recipient = match ($channel) {
                        'in_app' => 'member:'.$member->id,
                        'email' => $member->email,
                        'sms', 'whatsapp' => $member->phone,
                        default => null,
                    };
                    if (! is_string($recipient) || trim($recipient) === '') {
                        continue;
                    }

                    $available = [
                        'member_name' => $member->fullName(),
                        'announcement_title' => $announcement->title,
                        'announcement_message' => $announcement->message,
                    ];
                    $allowed = $template->variables ?? [];
                    $variables = array_intersect_key($available, array_flip($allowed));
                    $dispatcher->dispatchDirect(
                        $this->tenantId,
                        $announcement->branch_id,
                        $member->id,
                        $template,
                        $channel,
                        $recipient,
                        hash('sha256', "announcement|{$announcement->id}|{$member->id}|{$channel}"),
                        $variables,
                        $announcement->id,
                    );
                }
            }
        });

        Announcement::withoutGlobalScopes()
            ->where('tenant_id', $this->tenantId)
            ->whereKey($announcement->id)
            ->where('status', 'dispatching')
            ->update(['status' => 'dispatched', 'dispatched_at' => now()]);
    }
}
