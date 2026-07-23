<?php

use App\Models\Member;
use App\Models\Tenant;
use App\Services\Members\MemberNumberGenerator;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

it('lists members scoped to the current tenant', function () {
    $tenant = Tenant::factory()->create();
    $user = ownerFor($tenant);

    Member::factory()->for($tenant)->count(2)->create();
    Member::factory()->count(3)->create(); // other tenants

    $response = $this->actingAs($user)->get(route('members.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('members/index')
        ->has('members.data', 2)
    );
});

it('registers a new member and generates a tenant-scoped member number', function () {
    $tenant = Tenant::factory()->create(['slug' => 'iron-gym']);
    $user = ownerFor($tenant);

    $response = $this->actingAs($user)->post(route('members.store'), [
        'first_name' => 'Jane',
        'last_name' => 'Doe',
        'email' => 'jane@example.com',
        'phone' => '555-1000',
        'joined_at' => now()->toDateString(),
    ]);

    $member = Member::first();

    $response->assertRedirect(route('members.show', $member));
    expect($member->tenant_id)->toBe($tenant->id);
    expect($member->member_number)->toStartWith('IRON-');
    expect($member->status->value)->toBe('active');
    expect($member->created_by)->toBe($user->id);
});

it('issues sequential member numbers per tenant independently', function () {
    $tenantA = Tenant::factory()->create();
    $tenantB = Tenant::factory()->create();
    $generator = app(MemberNumberGenerator::class);

    $a1 = $generator->next($tenantA);
    $a2 = $generator->next($tenantA);
    $b1 = $generator->next($tenantB);

    expect($a1)->not->toBe($a2);
    expect(str_ends_with((string) $a1, '00001'))->toBeTrue();
    expect(str_ends_with((string) $a2, '00002'))->toBeTrue();
    expect(str_ends_with((string) $b1, '00001'))->toBeTrue();
});

it('stores an uploaded member photo', function () {
    Storage::fake('public');
    $tenant = Tenant::factory()->create();
    $user = ownerFor($tenant);

    $this->actingAs($user)->post(route('members.store'), [
        'first_name' => 'Photo',
        'last_name' => 'Member',
        'photo' => UploadedFile::fake()->image('avatar.jpg'),
    ]);

    $member = Member::first();

    expect($member->photo_path)->not->toBeNull();
    Storage::disk('public')->assertExists($member->photo_path);
});

it('updates an existing member', function () {
    $tenant = Tenant::factory()->create();
    $user = ownerFor($tenant);
    $member = Member::factory()->for($tenant)->create(['first_name' => 'Old']);

    $response = $this->actingAs($user)->put(route('members.update', $member), [
        'first_name' => 'New',
        'last_name' => $member->last_name,
    ]);

    $response->assertRedirect(route('members.show', $member));
    expect($member->fresh()->first_name)->toBe('New');
});

it('changes a member status and stamps archived_at when archiving', function () {
    $tenant = Tenant::factory()->create();
    $user = ownerFor($tenant);
    $member = Member::factory()->for($tenant)->create();

    $this->actingAs($user)->patch(route('members.status.update', $member), ['status' => 'archived']);

    $member->refresh();
    expect($member->status->value)->toBe('archived');
    expect($member->archived_at)->not->toBeNull();
});

it('shows a member with their documents as a plain array', function () {
    $tenant = Tenant::factory()->create();
    $user = ownerFor($tenant);
    $member = Member::factory()->for($tenant)->create();
    $member->documents()->create([
        'tenant_id' => $tenant->id,
        'name' => 'ID card',
        'file_path' => 'members/documents/id-card.pdf',
        'mime_type' => 'application/pdf',
        'size' => 1024,
    ]);

    $response = $this->actingAs($user)->get(route('members.show', $member));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('members/show')
        ->has('documents', 1)
        ->where('documents.0.name', 'ID card')
    );
});

it('returns a 404 when a member belongs to another tenant', function () {
    $tenant = Tenant::factory()->create();
    $user = ownerFor($tenant);
    $otherMember = Member::factory()->create();

    $this->actingAs($user)->get(route('members.show', $otherMember))->assertNotFound();
});
