<?php

namespace Database\Factories;

use App\Models\Tenant;
use App\Modules\Membership\Enums\MembershipEventType;
use App\Modules\Membership\Models\Membership;
use App\Modules\Membership\Models\MembershipEvent;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<MembershipEvent>
 */
class MembershipEventFactory extends Factory
{
    protected $model = MembershipEvent::class;

    public function definition(): array
    {
        return [
            'tenant_id' => Tenant::factory(),
            'membership_id' => Membership::factory(),
            'type' => MembershipEventType::Created,
            'from_status' => null,
            'to_status' => 'pending',
            'occurred_at' => now(),
            'metadata' => [],
        ];
    }
}
