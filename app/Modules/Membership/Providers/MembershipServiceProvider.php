<?php

namespace App\Modules\Membership\Providers;

use App\Modules\Membership\Console\Commands\ProcessMembershipExpiryCommand;
use App\Modules\Membership\Contracts\InvoiceCreator;
use App\Modules\Membership\Contracts\MembershipAccessChecker;
use App\Modules\Membership\Contracts\MembershipDateCalculator;
use App\Modules\Membership\Contracts\MembershipPriceCalculator;
use App\Modules\Membership\Contracts\PaymentRecorder;
use App\Modules\Membership\Contracts\ReceiptGenerator;
use App\Modules\Membership\Services\MembershipAccessCheckerService;
use App\Modules\Membership\Services\MembershipDateCalculatorService;
use App\Modules\Membership\Services\MembershipPriceCalculatorService;
use App\Modules\Membership\Testing\FakeInvoiceCreator;
use App\Modules\Membership\Testing\FakePaymentRecorder;
use App\Modules\Membership\Testing\FakeReceiptGenerator;
use Illuminate\Support\ServiceProvider;

/**
 * Binds Membership's own contracts, plus module-local fakes for the
 * cross-module contracts (InvoiceCreator, PaymentRecorder,
 * ReceiptGenerator) that Billing's worktree hasn't landed yet. See
 * INTEGRATION_NOTES.md for exactly what to swap at the Phase 2 merge.
 */
class MembershipServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(MembershipDateCalculator::class, MembershipDateCalculatorService::class);
        $this->app->bind(MembershipPriceCalculator::class, MembershipPriceCalculatorService::class);
        $this->app->bind(MembershipAccessChecker::class, MembershipAccessCheckerService::class);

        // Pending Billing's real implementations (see INTEGRATION_NOTES.md).
        $this->app->bind(InvoiceCreator::class, FakeInvoiceCreator::class);
        $this->app->bind(PaymentRecorder::class, FakePaymentRecorder::class);
        $this->app->bind(ReceiptGenerator::class, FakeReceiptGenerator::class);
    }

    public function boot(): void
    {
        if ($this->app->runningInConsole()) {
            $this->commands([ProcessMembershipExpiryCommand::class]);
        }
    }
}
