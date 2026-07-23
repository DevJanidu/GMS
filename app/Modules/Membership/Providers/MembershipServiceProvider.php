<?php

namespace App\Modules\Membership\Providers;

use App\Modules\Billing\Integration\MembershipInvoiceCreatorAdapter;
use App\Modules\Billing\Integration\MembershipPaymentRecorderAdapter;
use App\Modules\Billing\Integration\MembershipReceiptGeneratorAdapter;
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
use Illuminate\Support\ServiceProvider;

class MembershipServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(MembershipDateCalculator::class, MembershipDateCalculatorService::class);
        $this->app->bind(MembershipPriceCalculator::class, MembershipPriceCalculatorService::class);
        $this->app->bind(MembershipAccessChecker::class, MembershipAccessCheckerService::class);

        $this->app->bind(InvoiceCreator::class, MembershipInvoiceCreatorAdapter::class);
        $this->app->bind(PaymentRecorder::class, MembershipPaymentRecorderAdapter::class);
        $this->app->bind(ReceiptGenerator::class, MembershipReceiptGeneratorAdapter::class);
    }

    public function boot(): void
    {
        if ($this->app->runningInConsole()) {
            $this->commands([ProcessMembershipExpiryCommand::class]);
        }
    }
}
