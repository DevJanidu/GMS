<?php

namespace App\Modules\Membership\Actions;

use App\Models\Plan;
use App\Modules\Membership\Contracts\MembershipDateCalculator;
use App\Modules\Membership\Contracts\MembershipPriceCalculator;
use App\Modules\Membership\Enums\MembershipEventType;
use App\Modules\Membership\Enums\MembershipStatus;
use App\Modules\Membership\Events\MembershipActivated;
use App\Modules\Membership\Events\MembershipRenewed;
use App\Modules\Membership\Models\Membership;
use App\Modules\Membership\Services\MembershipBillingOrchestrator;
use App\Modules\Membership\Services\MembershipEventRecorder;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

/**
 * Renews a membership into a new, linked record. The new start date is
 * always computed (never accepted from user input) so an early renewal can
 * never overlap with — and therefore never loses — days already paid for
 * on the current membership (SRS Phase 2 completion criterion).
 */
class RenewMembershipAction
{
    public function __construct(
        private readonly MembershipDateCalculator $dateCalculator,
        private readonly MembershipPriceCalculator $priceCalculator,
        private readonly MembershipBillingOrchestrator $billing,
        private readonly MembershipEventRecorder $eventRecorder,
    ) {}

    public function execute(
        Membership $current,
        Plan $plan,
        ?int $renewedBy,
        ?float $initialPayment = null,
        ?string $paymentMethod = null,
        ?string $notes = null,
    ): Membership {
        $this->guardAgainstIneligibleRenewal($current, $plan);

        $newStartsOn = $current->expires_on->isFuture()
            ? $current->expires_on->addDay()
            : now()->toImmutable()->startOfDay();

        $dates = $this->dateCalculator->calculate($plan, $newStartsOn);
        $price = $this->priceCalculator->calculate($plan);
        $activatesNow = ! $dates->startsOn->isFuture();

        return DB::transaction(function () use (
            $current, $plan, $dates, $price, $activatesNow,
            $renewedBy, $initialPayment, $paymentMethod, $notes,
        ) {
            $membership = new Membership;
            $membership->tenant_id = $current->tenant_id;
            $membership->branch_id = $current->branch_id;
            $membership->member_id = $current->member_id;
            $membership->plan_id = $plan->id;
            $membership->plan_name_snapshot = $plan->name;
            $membership->plan_price_snapshot = number_format($price->price, 2, '.', '');
            $membership->plan_joining_fee_snapshot = number_format($price->joiningFee, 2, '.', '');
            $membership->plan_duration_value_snapshot = $plan->duration_value;
            $membership->plan_duration_unit_snapshot = $plan->duration_unit->value;
            $membership->plan_access_rules_snapshot = $plan->access_rules;
            $membership->starts_on = $dates->startsOn;
            $membership->expires_on = $dates->expiresOn;
            $membership->grace_days = $dates->graceDays;
            $membership->grace_ends_on = $dates->graceEndsOn;
            $membership->status = $activatesNow ? MembershipStatus::Active : MembershipStatus::Pending;
            $membership->previous_membership_id = $current->id;
            $membership->sold_by = $renewedBy;
            $membership->sold_at = now();
            $membership->notes = $notes;
            $membership->created_by = $renewedBy;
            $membership->save();

            $settlement = $this->billing->settle($membership, $price, true, $renewedBy, $initialPayment, $paymentMethod);
            $membership->invoice_id = $settlement['invoice_id'];
            $membership->save();

            $this->eventRecorder->record(
                $membership,
                MembershipEventType::Created,
                null,
                $membership->status,
                $renewedBy,
                ['renewed_from_membership_id' => $current->id],
            );

            $this->eventRecorder->record(
                $current,
                MembershipEventType::Renewed,
                $current->status,
                $current->status,
                $renewedBy,
                ['renewed_into_membership_id' => $membership->id],
            );

            if ($activatesNow) {
                $this->eventRecorder->record(
                    $membership,
                    MembershipEventType::Activated,
                    MembershipStatus::Pending,
                    MembershipStatus::Active,
                    $renewedBy,
                );
            }

            DB::afterCommit(function () use ($membership, $current, $activatesNow) {
                MembershipRenewed::dispatch($membership, $current);

                if ($activatesNow) {
                    MembershipActivated::dispatch($membership);
                }
            });

            return $membership;
        });
    }

    private function guardAgainstIneligibleRenewal(Membership $current, Plan $plan): void
    {
        if ($current->status === MembershipStatus::Cancelled) {
            throw ValidationException::withMessages([
                'membership' => 'A cancelled membership cannot be renewed; sell a new membership instead.',
            ]);
        }

        if ($current->hasForwardRenewal()) {
            throw ValidationException::withMessages([
                'membership' => 'This membership has already been renewed.',
            ]);
        }

        if (! $plan->isActive()) {
            throw ValidationException::withMessages([
                'plan_id' => 'This plan is not active and cannot be renewed into.',
            ]);
        }

        if (! $plan->isAvailableAtBranch($current->branch_id)) {
            throw ValidationException::withMessages([
                'plan_id' => 'This plan is not available at the membership\'s branch.',
            ]);
        }
    }
}
