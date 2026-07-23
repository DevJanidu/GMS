<?php

namespace App\Modules\Membership\Events;

use App\Modules\Membership\Models\Membership;
use Illuminate\Foundation\Events\Dispatchable;

class MembershipRenewed
{
    use Dispatchable;

    public function __construct(
        public readonly Membership $membership,
        public readonly Membership $previousMembership,
    ) {}
}
