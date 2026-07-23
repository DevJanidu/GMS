<?php

use App\Models\Tenant;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Concerns\InteractsWithPermissions;

uses(RefreshDatabase::class, InteractsWithPermissions::class);

it('requires authentication', function () {
    $this->getJson('/api/v1/branches')->assertUnauthorized();
});

it('allows an authenticated owner to list branches', function () {
    $tenant = Tenant::factory()->create();
    $user = $this->ownerUser($tenant);

    $response = $this->actingAs($user)->getJson('/api/v1/branches');

    $response->assertOk();
});
