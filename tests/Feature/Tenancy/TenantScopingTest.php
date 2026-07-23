<?php

use App\Models\Branch;
use App\Models\Tenant;
use App\Tenancy\Services\TenantContext;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('only returns branches belonging to the current tenant context', function () {
    $tenantA = Tenant::factory()->create();
    $tenantB = Tenant::factory()->create();

    $branchA = Branch::factory()->for($tenantA)->create();
    Branch::factory()->for($tenantB)->create();

    app(TenantContext::class)->set($tenantA);

    $branches = Branch::all();

    expect($branches)->toHaveCount(1);
    expect($branches->first()->id)->toBe($branchA->id);
});

it('returns every branch when no tenant context is bound', function () {
    Branch::factory()->count(2)->create();

    expect(Branch::all())->toHaveCount(2);
});

it('auto-fills tenant_id from the current tenant context on create', function () {
    $tenant = Tenant::factory()->create();

    app(TenantContext::class)->set($tenant);

    $branch = Branch::create([
        'name' => 'Auto Tenant Branch',
        'code' => 'AUTO',
        'status' => 'active',
    ]);

    expect($branch->tenant_id)->toBe($tenant->id);
});

it('enforces unique branch codes per tenant but allows reuse across tenants', function () {
    $tenantA = Tenant::factory()->create();
    $tenantB = Tenant::factory()->create();

    Branch::factory()->for($tenantA)->create(['code' => 'MAIN']);

    // Same code, different tenant: allowed.
    Branch::factory()->for($tenantB)->create(['code' => 'MAIN']);

    expect(Branch::withoutGlobalScopes()->where('code', 'MAIN')->count())->toBe(2);

    // Same code, same tenant: rejected by the database.
    expect(fn () => Branch::factory()->for($tenantA)->create(['code' => 'MAIN']))
        ->toThrow(QueryException::class);
});
