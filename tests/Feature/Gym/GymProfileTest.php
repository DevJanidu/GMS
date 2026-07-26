<?php

use App\Models\Tenant;
use App\Modules\Gym\Models\GymProfile;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\Concerns\InteractsWithPermissions;

uses(RefreshDatabase::class, InteractsWithPermissions::class);

it('auto-creates and returns the gym profile for the current tenant', function () {
    $tenant = Tenant::factory()->create(['name' => 'Iron Paradise']);
    $user = $this->userWithPermissions($tenant, ['gym.view']);

    $response = $this->actingAs($user)->getJson('/api/v1/gym/profile');

    $response->assertOk();
    $response->assertJsonPath('data.tenant.name', 'Iron Paradise');

    expect(GymProfile::where('tenant_id', $tenant->id)->count())->toBe(1);
});

it('denies viewing gym settings without the gym.view permission', function () {
    $tenant = Tenant::factory()->create();
    $user = $this->userWithPermissions($tenant, []);

    $this->actingAs($user)->getJson('/api/v1/gym/profile')->assertForbidden();
});

it('updates gym settings', function () {
    $tenant = Tenant::factory()->create();
    $user = $this->userWithPermissions($tenant, ['gym.update']);

    $response = $this->actingAs($user)->putJson('/api/v1/gym/profile', [
        'legal_name' => 'Iron Paradise LLC',
        'contact_email' => 'hello@ironparadise.gym',
        'website' => 'https://ironparadise.gym',
    ]);

    $response->assertOk();
    $response->assertJsonPath('data.legal_name', 'Iron Paradise LLC');

    expect(GymProfile::where('tenant_id', $tenant->id)->first()->contact_email)->toBe('hello@ironparadise.gym');
});

it('uploads and replaces the gym logo', function () {
    Storage::fake('public');

    $tenant = Tenant::factory()->create();
    $user = $this->userWithPermissions($tenant, ['gym.update']);

    $first = UploadedFile::fake()->image('logo.png');

    $response = $this->actingAs($user)->post('/api/v1/gym/profile', [
        '_method' => 'PUT',
        'legal_name' => 'Iron Paradise',
        'logo' => $first,
    ]);

    $response->assertOk();
    $firstPath = GymProfile::where('tenant_id', $tenant->id)->first()->logo_path;

    expect($firstPath)->not->toBeNull();
    Storage::disk('public')->assertExists($firstPath);
    expect($response->json('data.logo_url'))->toContain($firstPath);

    $second = UploadedFile::fake()->image('new-logo.png');

    $this->actingAs($user)->post('/api/v1/gym/profile', [
        '_method' => 'PUT',
        'legal_name' => 'Iron Paradise',
        'logo' => $second,
    ])->assertOk();

    Storage::disk('public')->assertMissing($firstPath);
    expect(GymProfile::where('tenant_id', $tenant->id)->first()->logo_path)->not->toBe($firstPath);
});

it('keeps gym profiles isolated per tenant', function () {
    $tenantA = Tenant::factory()->create();
    $tenantB = Tenant::factory()->create();
    $userA = $this->userWithPermissions($tenantA, ['gym.update']);
    $userB = $this->userWithPermissions($tenantB, ['gym.view']);

    $this->actingAs($userA)->putJson('/api/v1/gym/profile', ['legal_name' => 'Tenant A Gym'])->assertOk();

    $response = $this->actingAs($userB)->getJson('/api/v1/gym/profile');

    $response->assertOk();
    expect($response->json('data.legal_name'))->toBeNull();
});
