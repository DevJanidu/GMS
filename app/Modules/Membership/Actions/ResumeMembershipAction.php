<?php

namespace App\Modules\Membership\Actions;

use App\Modules\Membership\Enums\MembershipEventType;
use App\Modules\Membership\Enums\MembershipStatus;
use App\Modules\Membership\Events\MembershipActivated;
use App\Modules\Membership\Models\Membership;
use App\Modules\Membership\Services\MembershipEventRecorder;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

/**
 * Ends a freeze early or on schedule. The paused days are added back onto
 * expires_on/grace_ends_on so a freeze never costs the member paid time.
 */
class ResumeMembershipAction
{
    public function __construct(private readonly MembershipEventRecorder $eventRecorder) {}

    public function execute(Membership $membership, ?int $actorId): Membership
    {
        if ($membership->status !== MembershipStatus::Frozen) {
            throw ValidationException::withMessages([
                'membership' => 'Only a frozen membership can be resumed.',
            ]);
        }

        return DB::transaction(function () use ($membership, $actorId) {
            $frozenDays = (int) $membership->freeze_started_on->diffInDays(now()->toImmutable()->startOfDay());

            $membership->expires_on = $membership->expires_on->addDays($frozenDays);
            $membership->grace_ends_on = $membership->grace_ends_on->addDays($frozenDays);
            $membership->frozen_days_used += $frozenDays;
            $membership->freeze_started_on = null;
            $membership->freeze_resumes_on = null;
            $membership->status = MembershipStatus::Active;
            $membership->save();

            $this->eventRecorder->record(
                $membership,
                MembershipEventType::Resumed,
                MembershipStatus::Frozen,
                MembershipStatus::Active,
                $actorId,
                ['frozen_days_credited' => $frozenDays],
            );

            DB::afterCommit(fn () => MembershipActivated::dispatch($membership));

            return $membership;
        });
    }
}
