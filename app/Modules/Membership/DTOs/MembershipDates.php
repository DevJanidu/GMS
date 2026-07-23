<?php

namespace App\Modules\Membership\DTOs;

use Carbon\CarbonImmutable;

final readonly class MembershipDates
{
    public function __construct(
        public CarbonImmutable $startsOn,
        public CarbonImmutable $expiresOn,
        public int $graceDays,
        public CarbonImmutable $graceEndsOn,
    ) {}
}
