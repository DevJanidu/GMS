<?php

namespace App\Modules\AccessControl\Support;

/**
 * The full catalog of permission slugs the application understands,
 * grouped for the permission-matrix UI and for seeding.
 */
class PermissionCatalog
{
    /**
     * @return array<string, array<string, string>>
     */
    public static function all(): array
    {
        return [
            'Gym' => [
                'gym.view' => 'View gym settings',
                'gym.update' => 'Update gym settings',
            ],
            'Branches' => [
                'branches.view' => 'View branches',
                'branches.create' => 'Create branches',
                'branches.update' => 'Update branches',
                'branches.delete' => 'Delete branches',
            ],
            'Staff' => [
                'staff.view' => 'View staff',
                'staff.create' => 'Invite staff',
                'staff.update' => 'Update staff',
                'staff.delete' => 'Remove staff',
                'staff.suspend' => 'Suspend or activate staff',
                'staff.assign-branches' => 'Assign staff to branches',
            ],
            'Roles' => [
                'roles.view' => 'View roles',
                'roles.create' => 'Create roles',
                'roles.update' => 'Update roles',
                'roles.delete' => 'Delete roles',
            ],
        ];
    }

    /**
     * @return list<string>
     */
    public static function slugs(): array
    {
        return array_merge(...array_map(
            fn (array $permissions) => array_keys($permissions),
            array_values(static::all()),
        ));
    }
}
