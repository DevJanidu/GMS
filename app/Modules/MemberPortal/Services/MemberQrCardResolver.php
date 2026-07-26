<?php

namespace App\Modules\MemberPortal\Services;

use App\Models\Member;
use App\Modules\MemberPortal\Contracts\MemberQrCardProvider;
use App\Modules\MemberPortal\DTOs\MemberQrCard;
use Illuminate\Contracts\Container\Container;

class MemberQrCardResolver
{
    public function __construct(private Container $container) {}

    public function forMember(Member $member): MemberQrCard
    {
        $provider = $this->container->bound(MemberQrCardProvider::class)
            ? $this->container->make(MemberQrCardProvider::class)
            : new UnavailableMemberQrCardProvider;

        return $provider->forMember($member);
    }
}
