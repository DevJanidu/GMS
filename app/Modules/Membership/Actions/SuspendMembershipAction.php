<?php

namespace App\Modules\Membership\Actions;

use App\Modules\Membership\Enums\MembershipEventType;
use App\Modules\Membership\Enums\MembershipStatus;
use App\Modules\Membership\Events\MembershipSuspended;
use App\Modules\Membership\Models\Membership;
use App\Modules\Membership\Services\MembershipEventRecorder;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

/**
 * Suspension is a staff-imposed access block (non-payment, discipline,
 * ...), distinct from a member-initiated freeze: it does not extend
 * expires_on, since it is not a benefit being preserved for the member.
 */
class SuspendMembershipAction
{
    public function __construct(private readonly MembershipEventRecorder $eventRecorder) {}

    public function execute(Membership $membership, string $reason, ?int $actorId): Membership
    {
        if ($membership->status !== MembershipStatus::Active) {
            throw ValidationException::withMessages([
                'membership' => 'Only an active membership can be suspended.',
            ]);
        }

        return DB::transaction(function () use ($membership, $reason, $actorId) {
            $from = $membership->status;

            $membership->status = MembershipStatus::Suspended;
            $membership->suspended_at = now();
            $membership->suspension_reason = $reason;
            $membership->save();

            $this->eventRecorder->record(
                $membership,
                MembershipEventType::Suspended,
                $from,
                MembershipStatus::Suspended,
                $actorId,
                ['reason' => $reason],
            );

            DB::afterCommit(fn () => MembershipSuspended::dispatch($membership));

            return $membership;
        });
    }
}
