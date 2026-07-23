<?php

use App\Models\Member;
use App\Models\Tenant;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

it('uploads a document for a member', function () {
    Storage::fake('public');
    $tenant = Tenant::factory()->create();
    $user = ownerFor($tenant);
    $member = Member::factory()->for($tenant)->create();

    $response = $this->actingAs($user)->post(route('members.documents.store', $member), [
        'name' => 'ID Card',
        'file' => UploadedFile::fake()->create('id.pdf', 100),
    ]);

    $response->assertRedirect();
    expect($member->documents()->count())->toBe(1);

    $document = $member->documents()->first();
    expect($document->name)->toBe('ID Card');
    Storage::disk('public')->assertExists($document->file_path);
});

it('deletes a document belonging to the member', function () {
    Storage::fake('public');
    $tenant = Tenant::factory()->create();
    $user = ownerFor($tenant);
    $member = Member::factory()->for($tenant)->create();
    $document = $member->documents()->create([
        'tenant_id' => $tenant->id,
        'name' => 'Waiver',
        'file_path' => 'members/documents/waiver.pdf',
    ]);

    $response = $this->actingAs($user)->delete(route('members.documents.destroy', [$member, $document]));

    $response->assertRedirect();
    expect($member->documents()->count())->toBe(0);
});

it('refuses to delete a document that belongs to a different member', function () {
    $tenant = Tenant::factory()->create();
    $user = ownerFor($tenant);
    $memberA = Member::factory()->for($tenant)->create();
    $memberB = Member::factory()->for($tenant)->create();
    $document = $memberA->documents()->create([
        'tenant_id' => $tenant->id,
        'name' => 'Waiver',
        'file_path' => 'members/documents/waiver.pdf',
    ]);

    $this->actingAs($user)->delete(route('members.documents.destroy', [$memberB, $document]))->assertNotFound();
});
