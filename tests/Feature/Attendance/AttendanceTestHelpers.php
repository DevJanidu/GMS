<?php

use App\Models\Branch;
use App\Models\Member;
use App\Models\Permission;
use App\Models\Plan;
use App\Models\Role;
use App\Models\Tenant;
use App\Models\User;
use App\Modules\Membership\Models\Membership;
use Illuminate\Testing\TestResponse;

/**
 * @param  list<string>  $permissions
 */
function attendanceUser(Tenant $tenant, Branch $branch, array $permissions = [], bool $owner = false): User
{
    $user = User::factory()->create(['tenant_id' => $tenant->id]);
    $role = $owner
        ? Role::query()->firstOrCreate(
            ['tenant_id' => null, 'slug' => 'owner'],
            ['name' => 'Owner', 'is_system' => true],
        )
        : Role::factory()->create(['tenant_id' => $tenant->id]);

    if (! $owner) {
        $permissionModels = collect($permissions)->map(
            fn (string $slug) => Permission::query()->firstOrCreate(
                ['slug' => $slug],
                ['name' => $slug],
            ),
        );
        $role->permissions()->sync($permissionModels->pluck('id'));
    }

    $user->roles()->attach($role);
    $user->branches()->attach($branch, ['is_primary' => true]);

    return $user;
}

/**
 * @param  array<string, mixed>  $memberAttributes
 * @param  array<string, mixed>  $planAttributes
 * @param  array<string, mixed>  $membershipAttributes
 * @return array{tenant:Tenant,branch:Branch,user:User,member:Member,plan:Plan,membership:Membership}
 */
function attendanceFixture(
    array $memberAttributes = [],
    array $planAttributes = [],
    array $membershipAttributes = [],
): array {
    config(['app.key' => 'base64:'.base64_encode(str_repeat('a', 32))]);
    config(['logging.default' => 'null']);

    $tenant = Tenant::factory()->create(['timezone' => 'Asia/Colombo']);
    $branch = Branch::factory()->for($tenant)->create();
    $user = attendanceUser($tenant, $branch, owner: true);
    $member = Member::factory()->for($tenant)->create([
        'branch_id' => $branch->id,
        ...$memberAttributes,
    ]);
    $plan = Plan::factory()->for($tenant)->create($planAttributes);
    $membership = Membership::factory()->for($tenant)->create([
        'branch_id' => $branch->id,
        'member_id' => $member->id,
        'plan_id' => $plan->id,
        ...$membershipAttributes,
    ]);

    return compact('tenant', 'branch', 'user', 'member', 'plan', 'membership');
}

/**
 * @param  array<string, mixed>  $payload
 */
function attendancePost(object $test, array $fixture, string $path, array $payload): TestResponse
{
    return $test->actingAs($fixture['user'])
        ->withHeader('X-Branch-Id', (string) $fixture['branch']->id)
        ->postJson($path, $payload);
}

function attendanceQrToken(object $test, array $fixture): string
{
    return attendancePost($test, $fixture, '/api/v1/attendance/qr/rotate', [
        'member_id' => $fixture['member']->id,
    ])->assertOk()->json('data.qr_token');
}

/**
 * @param  array<string, mixed>  $overrides
 */
function attendanceScan(object $test, array $fixture, string $token, array $overrides = []): TestResponse
{
    return attendancePost($test, $fixture, '/api/v1/attendance/scans', [
        'qr_token' => $token,
        'request_id' => fake()->uuid(),
        'source' => 'phone_camera',
        'device_id' => 'test-phone',
        'action' => 'auto',
        ...$overrides,
    ]);
}
