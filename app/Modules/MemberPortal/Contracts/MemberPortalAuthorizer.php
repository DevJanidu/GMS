<?php

namespace App\Modules\MemberPortal\Contracts;

use App\Models\User;
use App\Modules\MemberPortal\Models\MemberPortalAccount;

interface MemberPortalAuthorizer
{
    public function accountFor(User $user): MemberPortalAccount;
}
