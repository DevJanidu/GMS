<?php

use App\Models\Tenant;
use App\Models\User;
use App\Tenancy\Services\TenantContext;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Route;

uses(RefreshDatabase::class);

beforeEach(function () {
    Route::middleware(['web', 'auth', 'tenant'])->get('/__test/tenant-probe', function () {
        return response()->json([
            'tenant_id' => app(TenantContext::class)->id(),
        ]);
    });
});

it('binds the authenticated user tenant into the tenant context', function () {
    $tenant = Tenant::factory()->create();
    $user = User::factory()->create(['tenant_id' => $tenant->id]);

    $response = $this->actingAs($user)->get('/__test/tenant-probe');

    $response->assertOk();
    $response->assertJson(['tenant_id' => $tenant->id]);
});

it('rejects users whose tenant has been suspended', function () {
    $tenant = Tenant::factory()->suspended()->create();
    $user = User::factory()->create(['tenant_id' => $tenant->id]);

    $response = $this->actingAs($user)->get('/__test/tenant-probe');

    $response->assertForbidden();
});

it('does not require a tenant for guests', function () {
    Route::middleware(['web', 'tenant'])->get('/__test/tenant-probe-guest', function () {
        return response()->json(['ok' => true]);
    });

    $response = $this->get('/__test/tenant-probe-guest');

    $response->assertOk();
});
