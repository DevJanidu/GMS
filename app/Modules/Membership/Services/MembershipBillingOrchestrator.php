<?php

namespace App\Modules\Membership\Services;

use App\Modules\Membership\Contracts\InvoiceCreator;
use App\Modules\Membership\Contracts\PaymentRecorder;
use App\Modules\Membership\Contracts\ReceiptGenerator;
use App\Modules\Membership\DTOs\MembershipInvoiceData;
use App\Modules\Membership\DTOs\MembershipPriceBreakdown;
use App\Modules\Membership\Models\Membership;

/**
 * Steps 5-7 of the membership-sale orchestration in SRS B.5 ("Create
 * invoice through InvoiceCreator" / "Record optional initial payment" /
 * "Generate receipt"). Shared by SellMembershipAction and
 * RenewMembershipAction so neither one duplicates the Billing handoff.
 *
 * Membership never creates invoice/payment/receipt rows itself — every
 * step here goes through a contract Billing's worktree implements.
 */
class MembershipBillingOrchestrator
{
    public function __construct(
        private readonly InvoiceCreator $invoiceCreator,
        private readonly PaymentRecorder $paymentRecorder,
        private readonly ReceiptGenerator $receiptGenerator,
    ) {}

    /**
     * @return array{invoice_id: int, paid_in_full: bool}
     */
    public function settle(
        Membership $membership,
        MembershipPriceBreakdown $price,
        bool $isRenewal,
        ?int $soldBy,
        ?float $initialPayment,
        ?string $paymentMethod,
    ): array {
        $invoiceResult = $this->invoiceCreator->createForMembership(new MembershipInvoiceData(
            tenantId: $membership->tenant_id,
            branchId: $membership->branch_id,
            memberId: $membership->member_id,
            membershipId: $membership->id,
            planName: $membership->plan_name_snapshot,
            price: $price->price,
            joiningFee: $price->joiningFee,
            isRenewal: $isRenewal,
            soldBy: $soldBy,
            initialPayment: $initialPayment,
        ));

        $paidInFull = $invoiceResult->isPaidInFull();

        if ($initialPayment !== null && $initialPayment > 0) {
            $paymentResult = $this->paymentRecorder->recordForInvoice(
                $invoiceResult->invoiceId,
                $initialPayment,
                $paymentMethod ?? 'cash',
            );

            $this->receiptGenerator->generateForPayment($paymentResult->paymentId);

            $paidInFull = $paymentResult->remainingBalance <= 0.0;
        }

        return [
            'invoice_id' => $invoiceResult->invoiceId,
            'paid_in_full' => $paidInFull,
        ];
    }
}
