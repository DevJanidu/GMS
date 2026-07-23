<?php

namespace App\Modules\Membership\Actions;

use App\Modules\Membership\Enums\MembershipEventType;
use App\Modules\Membership\Enums\MembershipStatus;
use App\Modules\Membership\Events\MembershipActivated;
use App\Modules\Membership\Events\MembershipExpired;
use App\Modules\Membership\Models\Membership;
use App\Modules\Membership\Services\MembershipEventRecorder;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

/**
 * Reactivates a frozen or suspended membership. Cancelled and Expired
 * memberships are terminal by design (SRS: "reactivate eligible
 * memberships" implies not every membership qualifies) — sell a new
 * membership or renew instead.
 */
class ReactivateMembershipAction
{
    public function __construct(private readonly MembershipEventRecorder $eventRecorder) {}

    public function execute(Membership $membership, ?int $actorId): Membership
    {
        if (! $membership->status->isEligibleForReactivation()) {
            throw ValidationException::withMessages([
                'membership' => $membership->status->label().' memberships are not eligible for reactivation.',
            ]);
        }

        return DB::transaction(function () use ($membership, $actorId) {
            $from = $membership->status;

            if ($from === MembershipStatus::Frozen) {
                $frozenDays = (int) $membership->freeze_started_on->diffInDays(now()->toImmutable()->startOfDay());
                $membership->expires_on = $membership->expires_on->addDays($frozenDays);
                $membership->grace_ends_on = $membership->grace_ends_on->addDays($frozenDays);
                $membership->frozen_days_used += $frozenDays;
                $membership->freeze_started_on = null;
                $membership->freeze_resumes_on = null;
            } else {
                $membership->suspended_at = null;
                $membership->suspension_reason = null;
            }

            $today = now()->toImmutable()->startOfDay();
            $stillWithinTerm = ! $today->greaterThan($membership->grace_ends_on);

            $membership->status = $stillWithinTerm ? MembershipStatus::Active : MembershipStatus::Expired;
            $membership->expired_at = $stillWithinTerm ? null : now();
            $membership->save();

            $this->eventRecorder->record(
                $membership,
                MembershipEventType::Reactivated,
                $from,
                $membership->status,
                $actorId,
            );

            DB::afterCommit(function () use ($membership, $stillWithinTerm) {
                if ($stillWithinTerm) {
                    MembershipActivated::dispatch($membership);
                } else {
                    MembershipExpired::dispatch($membership);
                }
            });

            return $membership;
        });
    }
}
