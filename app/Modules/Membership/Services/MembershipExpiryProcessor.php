<?php

namespace App\Modules\Membership\Services;

use App\Modules\Membership\Enums\MembershipEventType;
use App\Modules\Membership\Enums\MembershipStatus;
use App\Modules\Membership\Events\MembershipExpired;
use App\Modules\Membership\Events\MembershipExpiring;
use App\Modules\Membership\Models\Membership;
use Carbon\CarbonImmutable;

/**
 * Backs the daily expiry scheduler (SRS: "Run the daily expiry scheduler",
 * "Detect expiring memberships", "Detect expired memberships"). Runs
 * without any tenant/branch context bound, so it sweeps every tenant in
 * one pass (TenantScope is a no-op outside a request — see TenantScope).
 */
class MembershipExpiryProcessor
{
    public function __construct(private readonly MembershipEventRecorder $eventRecorder) {}

    /**
     * @return array{expiring: int, expired: int}
     */
    public function process(): array
    {
        return [
            'expiring' => $this->markExpiringSoon(),
            'expired' => $this->markExpired(),
        ];
    }

    private function markExpiringSoon(): int
    {
        $today = CarbonImmutable::now()->startOfDay();
        $threshold = $today->addDays((int) config('membership.expiring_soon_within_days'));
        $count = 0;

        Membership::query()
            ->where('status', MembershipStatus::Active)
            ->whereNull('expiring_notified_at')
            ->whereDate('expires_on', '>=', $today->toDateString())
            ->whereDate('expires_on', '<=', $threshold->toDateString())
            ->whereDoesntHave('renewal')
            ->chunkById(100, function ($memberships) use (&$count) {
                foreach ($memberships as $membership) {
                    $membership->expiring_notified_at = now();
                    $membership->save();

                    $this->eventRecorder->record(
                        $membership,
                        MembershipEventType::ExpiringSoon,
                        $membership->status,
                        $membership->status,
                    );

                    MembershipExpiring::dispatch($membership);
                    $count++;
                }
            });

        return $count;
    }

    private function markExpired(): int
    {
        $today = CarbonImmutable::now()->startOfDay();
        $count = 0;

        // Frozen memberships are excluded: their clock is intentionally
        // paused, and expires_on is only recalculated on resume/reactivate.
        Membership::query()
            ->whereIn('status', [MembershipStatus::Active, MembershipStatus::Suspended])
            ->whereDate('grace_ends_on', '<', $today->toDateString())
            ->chunkById(100, function ($memberships) use (&$count) {
                foreach ($memberships as $membership) {
                    $from = $membership->status;

                    $membership->status = MembershipStatus::Expired;
                    $membership->expired_at = now();
                    $membership->save();

                    $this->eventRecorder->record(
                        $membership,
                        MembershipEventType::Expired,
                        $from,
                        MembershipStatus::Expired,
                    );

                    MembershipExpired::dispatch($membership);
                    $count++;
                }
            });

        return $count;
    }
}
