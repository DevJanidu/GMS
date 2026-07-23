<?php

namespace App\Providers;

use App\Models\Branch;
use App\Models\Role;
use App\Models\User;
use App\Modules\AccessControl\Policies\RolePolicy;
use App\Modules\Branch\Policies\BranchPolicy;
use App\Modules\Gym\Support\GymProfileGate;
use App\Modules\Membership\Models\Membership;
use App\Modules\Membership\Policies\MembershipPolicy;
use App\Modules\Staff\Policies\StaffPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AuthorizationServiceProvider extends ServiceProvider
{
    /**
     * Policies live inside their owning module rather than app/Policies,
     * so Laravel's convention-based discovery can't find them; they are
     * registered explicitly here instead.
     *
     * @var array<class-string, class-string>
     */
    protected array $policies = [
        Branch::class => BranchPolicy::class,
        Role::class => RolePolicy::class,
        User::class => StaffPolicy::class,
        Membership::class => MembershipPolicy::class,
    ];

    public function boot(): void
    {
        foreach ($this->policies as $model => $policy) {
            Gate::policy($model, $policy);
        }

        Gate::define('gym.view', [GymProfileGate::class, 'view']);
        Gate::define('gym.update', [GymProfileGate::class, 'update']);

        // The "owner" role always passes authorization; every other ability
        // is decided by the policies built on top of AuthorizesViaPermissions.
        Gate::before(function (User $user, string $ability) {
            return $user->hasRole('owner') ? true : null;
        });
    }
}
