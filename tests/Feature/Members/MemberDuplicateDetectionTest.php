<?php

use App\Models\Member;
use App\Models\Tenant;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('warns instead of creating when a matching email already exists', function () {
    $tenant = Tenant::factory()->create();
    $user = ownerFor($tenant);
    $existing = Member::factory()->for($tenant)->create(['email' => 'dup@example.com']);

    $response = $this->actingAs($user)->post(route('members.store'), [
        'first_name' => 'Someone',
        'last_name' => 'Else',
        'email' => 'dup@example.com',
    ]);

    $response->assertRedirect();
    expect(Member::count())->toBe(1);
    $response->assertSessionHas('duplicates');
});

it('creates the member anyway once the duplicate is confirmed', function () {
    $tenant = Tenant::factory()->create();
    $user = ownerFor($tenant);
    Member::factory()->for($tenant)->create(['email' => 'dup@example.com']);

    $response = $this->actingAs($user)->post(route('members.store'), [
        'first_name' => 'Someone',
        'last_name' => 'Else',
        'email' => 'dup@example.com',
        'confirm_duplicate' => true,
    ]);

    $response->assertRedirect();
    expect(Member::count())->toBe(2);
});

it('does not flag members in other tenants as duplicates', function () {
    $tenant = Tenant::factory()->create();
    $user = ownerFor($tenant);
    Member::factory()->create(['email' => 'dup@example.com']); // other tenant

    $response = $this->actingAs($user)->post(route('members.store'), [
        'first_name' => 'Someone',
        'last_name' => 'Else',
        'email' => 'dup@example.com',
    ]);

    $response->assertSessionMissing('duplicates');
    expect(Member::query()->where('tenant_id', $tenant->id)->count())->toBe(1);
});
