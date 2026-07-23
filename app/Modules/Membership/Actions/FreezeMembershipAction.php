<?php

namespace App\Modules\Membership\Actions;

use App\Modules\Membership\Enums\MembershipEventType;
use App\Modules\Membership\Enums\MembershipStatus;
use App\Modules\Membership\Events\MembershipFrozen;
use App\Modules\Membership\Models\Membership;
use App\Modules\Membership\Services\MembershipEventRecorder;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class FreezeMembershipAction
{
    public function __construct(private readonly MembershipEventRecorder $eventRecorder) {}

    public function execute(
        Membership $membership,
        ?CarbonImmutable $resumesOn,
        ?int $actorId,
        ?string $reason = null,
    ): Membership {
        if ($membership->status !== MembershipStatus::Active) {
            throw ValidationException::withMessages([
                'membership' => 'Only an active membership can be frozen.',
            ]);
        }

        return DB::transaction(function () use ($membership, $resumesOn, $actorId, $reason) {
            $from = $membership->status;

            $membership->status = MembershipStatus::Frozen;
            $membership->freeze_started_on = now()->toDateString();
            $membership->freeze_resumes_on = $resumesOn?->toDateString();
            $membership->save();

            $this->eventRecorder->record(
                $membership,
                MembershipEventType::Frozen,
                $from,
                MembershipStatus::Frozen,
                $actorId,
                array_filter(['reason' => $reason, 'freeze_resumes_on' => $resumesOn?->toDateString()]),
            );

            DB::afterCommit(fn () => MembershipFrozen::dispatch($membership));

            return $membership;
        });
    }
}
