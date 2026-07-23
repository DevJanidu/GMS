<?php

namespace App\Modules\Membership\Console\Commands;

use App\Modules\Membership\Services\MembershipExpiryProcessor;
use Illuminate\Console\Command;

class ProcessMembershipExpiryCommand extends Command
{
    protected $signature = 'membership:process-expiry';

    protected $description = 'Flag memberships entering their expiring-soon window and expire those past their grace period.';

    public function handle(MembershipExpiryProcessor $processor): int
    {
        $result = $processor->process();

        $this->info("Marked {$result['expiring']} membership(s) as expiring soon.");
        $this->info("Expired {$result['expired']} membership(s).");

        return self::SUCCESS;
    }
}
