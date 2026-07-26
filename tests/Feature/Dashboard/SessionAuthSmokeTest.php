<?php

use App\Models\Branch;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Concerns\InteractsWithPermissions;

uses(RefreshDatabase::class, InteractsWithPermissions::class);

it('authenticates api requests via the session cookie like a real browser SPA request, not actingAs', function () {
    $tenant = Tenant::factory()->create();
    $branch = Branch::factory()->for($tenant)->create();
    $owner = $this->ownerUser($tenant);
    $owner->branches()->attach($branch, ['is_primary' => true]);

    $login = $this->post('/login', [
        'email' => $owner->email,
        'password' => 'password',
    ]);

    $login->assertRedirect();
    $this->assertAuthenticatedAs($owner);

    $response = $this->getJson('/api/v1/dashboard/summary');
    $response->assertOk();
});
