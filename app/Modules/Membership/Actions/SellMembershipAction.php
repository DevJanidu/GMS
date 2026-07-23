<?php

namespace App\Modules\Membership\Actions;

use App\Models\Member;
use App\Models\Plan;
use App\Modules\Membership\Contracts\MembershipDateCalculator;
use App\Modules\Membership\Contracts\MembershipPriceCalculator;
use App\Modules\Membership\Enums\MembershipEventType;
use App\Modules\Membership\Enums\MembershipStatus;
use App\Modules\Membership\Events\MembershipActivated;
use App\Modules\Membership\Events\MembershipCreated;
use App\Modules\Membership\Models\Membership;
use App\Modules\Membership\Services\MembershipBillingOrchestrator;
use App\Modules\Membership\Services\MembershipEventRecorder;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

/**
 * Sells a membership to an existing member. Implements the ten-step
 * transaction described in SRS B.5 (validate -> calculate dates -> create
 * membership -> invoice via InvoiceCreator -> optional payment -> receipt
 * -> activate -> commit -> publish events after commit).
 */
class SellMembershipAction
{
    public function __construct(
        private readonly MembershipDateCalculator $dateCalculator,
        private readonly MembershipPriceCalculator $priceCalculator,
        private readonly MembershipBillingOrchestrator $billing,
        private readonly MembershipEventRecorder $eventRecorder,
    ) {}

    public function execute(
        Member $member,
        Plan $plan,
        int $branchId,
        CarbonImmutable $startsOn,
        ?int $soldBy,
        ?float $initialPayment = null,
        ?string $paymentMethod = null,
        ?string $notes = null,
    ): Membership {
        $this->guardAgainstIneligibleSale($member, $plan, $branchId);

        $dates = $this->dateCalculator->calculate($plan, $startsOn);
        $price = $this->priceCalculator->calculate($plan);
        $activatesNow = ! $dates->startsOn->isFuture();

        $membership = DB::transaction(function () use (
            $member, $plan, $branchId, $dates, $price, $activatesNow,
            $soldBy, $initialPayment, $paymentMethod, $notes,
        ) {
            $membership = new Membership;
            $membership->tenant_id = $member->tenant_id;
            $membership->branch_id = $branchId;
            $membership->member_id = $member->id;
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
            $membership->sold_by = $soldBy;
            $membership->sold_at = now();
            $membership->notes = $notes;
            $membership->created_by = $soldBy;
            $membership->save();

            $settlement = $this->billing->settle($membership, $price, false, $soldBy, $initialPayment, $paymentMethod);
            $membership->invoice_id = $settlement['invoice_id'];
            $membership->save();

            $this->eventRecorder->record(
                $membership,
                MembershipEventType::Created,
                null,
                $membership->status,
                $soldBy,
                ['plan_id' => $plan->id, 'branch_id' => $branchId],
            );

            if ($activatesNow) {
                $this->eventRecorder->record(
                    $membership,
                    MembershipEventType::Activated,
                    MembershipStatus::Pending,
                    MembershipStatus::Active,
                    $soldBy,
                );
            }

            DB::afterCommit(function () use ($membership, $activatesNow) {
                MembershipCreated::dispatch($membership);

                if ($activatesNow) {
                    MembershipActivated::dispatch($membership);
                }
            });

            return $membership;
        });

        return $membership;
    }

    private function guardAgainstIneligibleSale(Member $member, Plan $plan, int $branchId): void
    {
        if ($member->isArchived()) {
            throw ValidationException::withMessages([
                'member_id' => 'Archived members cannot purchase a membership.',
            ]);
        }

        if (! $plan->isActive()) {
            throw ValidationException::withMessages([
                'plan_id' => 'This plan is not active and cannot be sold.',
            ]);
        }

        if (! $plan->isAvailableAtBranch($branchId)) {
            throw ValidationException::withMessages([
                'plan_id' => 'This plan is not available at the selected branch.',
            ]);
        }
    }
}
