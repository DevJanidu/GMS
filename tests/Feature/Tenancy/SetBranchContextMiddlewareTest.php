<?php

use App\Models\Branch;
use App\Models\Tenant;
use App\Models\User;
use App\Tenancy\Services\BranchContext;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Route;

uses(RefreshDatabase::class);

beforeEach(function () {
    Route::middleware(['web', 'auth', 'branch'])->get('/__test/branch-probe', function () {
        return response()->json([
            'branch_id' => app(BranchContext::class)->id(),
        ]);
    });
});

it('defaults to the user primary branch', function () {
    $tenant = Tenant::factory()->create();
    $user = User::factory()->create(['tenant_id' => $tenant->id]);
    $primary = Branch::factory()->for($tenant)->create();
    $other = Branch::factory()->for($tenant)->create();

    $user->branches()->attach($primary, ['is_primary' => true]);
    $user->branches()->attach($other, ['is_primary' => false]);

    $response = $this->actingAs($user)->get('/__test/branch-probe');

    $response->assertOk();
    $response->assertJson(['branch_id' => $primary->id]);
});

it('honors an explicit branch header when the user is assigned to it', function () {
    $tenant = Tenant::factory()->create();
    $user = User::factory()->create(['tenant_id' => $tenant->id]);
    $branch = Branch::factory()->for($tenant)->create();

    $user->branches()->attach($branch);

    $response = $this->actingAs($user)
        ->withHeaders(['X-Branch-Id' => $branch->id])
        ->get('/__test/branch-probe');

    $response->assertOk();
    $response->assertJson(['branch_id' => $branch->id]);
});

it('rejects a branch header for a branch the user is not assigned to', function () {
    $tenant = Tenant::factory()->create();
    $user = User::factory()->create(['tenant_id' => $tenant->id]);
    $branch = Branch::factory()->for($tenant)->create();

    $response = $this->actingAs($user)
        ->withHeaders(['X-Branch-Id' => $branch->id])
        ->get('/__test/branch-probe');

    $response->assertForbidden();
});
