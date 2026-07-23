<?php

namespace App\Modules\Membership\Actions;

use App\Modules\Membership\Enums\MembershipEventType;
use App\Modules\Membership\Enums\MembershipStatus;
use App\Modules\Membership\Events\MembershipCancelled;
use App\Modules\Membership\Models\Membership;
use App\Modules\Membership\Services\MembershipEventRecorder;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CancelMembershipAction
{
    public function __construct(private readonly MembershipEventRecorder $eventRecorder) {}

    public function execute(Membership $membership, string $reason, ?int $actorId): Membership
    {
        if ($membership->status->isTerminal()) {
            throw ValidationException::withMessages([
                'membership' => 'This membership is already '.$membership->status->label().' and cannot be cancelled.',
            ]);
        }

        return DB::transaction(function () use ($membership, $reason, $actorId) {
            $from = $membership->status;

            $membership->status = MembershipStatus::Cancelled;
            $membership->cancelled_at = now();
            $membership->cancellation_reason = $reason;
            $membership->save();

            $this->eventRecorder->record(
                $membership,
                MembershipEventType::Cancelled,
                $from,
                MembershipStatus::Cancelled,
                $actorId,
                ['reason' => $reason],
            );

            DB::afterCommit(fn () => MembershipCancelled::dispatch($membership));

            return $membership;
        });
    }
}
