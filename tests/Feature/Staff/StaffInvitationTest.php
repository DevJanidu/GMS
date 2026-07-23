<?php

use App\Models\Tenant;
use App\Models\User;
use App\Modules\Staff\Models\StaffProfile;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\URL;

uses(RefreshDatabase::class);

it('shows invitation details for a valid signed url', function () {
    $tenant = Tenant::factory()->create();
    $user = User::factory()->create(['tenant_id' => $tenant->id, 'status' => 'invited']);
    StaffProfile::create(['tenant_id' => $tenant->id, 'user_id' => $user->id, 'invited_at' => now()]);

    $url = URL::temporarySignedRoute('staff.invitations.show', now()->addDays(7), ['user' => $user->id]);
    $path = parse_url($url, PHP_URL_PATH).'?'.parse_url($url, PHP_URL_QUERY);

    $response = $this->getJson($path);

    $response->assertOk();
    $response->assertJsonPath('data.email', $user->email);
});

it('rejects an invalid or tampered signature', function () {
    $tenant = Tenant::factory()->create();
    $user = User::factory()->create(['tenant_id' => $tenant->id, 'status' => 'invited']);

    $response = $this->getJson("/api/v1/staff/invitations/{$user->id}?signature=invalid&expires=".now()->addDay()->timestamp);

    $response->assertForbidden();
});

it('accepts an invitation and activates the account', function () {
    $tenant = Tenant::factory()->create();
    $user = User::factory()->create(['tenant_id' => $tenant->id, 'status' => 'invited']);
    StaffProfile::create(['tenant_id' => $tenant->id, 'user_id' => $user->id, 'invited_at' => now()]);

    $url = URL::temporarySignedRoute('staff.invitations.accept', now()->addDays(7), ['user' => $user->id]);
    $path = parse_url($url, PHP_URL_PATH).'?'.parse_url($url, PHP_URL_QUERY);

    $response = $this->postJson($path, [
        'password' => 'a-strong-password',
        'password_confirmation' => 'a-strong-password',
    ]);

    $response->assertOk();

    $user->refresh();
    expect($user->status)->toBe('active');
    expect($user->staffProfile->activated_at)->not->toBeNull();
    $this->assertAuthenticatedAs($user);
});

it('rejects accepting an invitation for an already-active user', function () {
    $tenant = Tenant::factory()->create();
    $user = User::factory()->create(['tenant_id' => $tenant->id, 'status' => 'active']);

    $url = URL::temporarySignedRoute('staff.invitations.accept', now()->addDays(7), ['user' => $user->id]);
    $path = parse_url($url, PHP_URL_PATH).'?'.parse_url($url, PHP_URL_QUERY);

    $response = $this->postJson($path, [
        'password' => 'a-strong-password',
        'password_confirmation' => 'a-strong-password',
    ]);

    $response->assertNotFound();
});
