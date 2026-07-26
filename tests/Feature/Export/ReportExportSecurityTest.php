<?php

use App\Models\Branch;
use App\Models\Tenant;
use App\Modules\Report\Jobs\GenerateReportExportJob;
use App\Modules\Report\Models\ReportExport;
use App\Modules\Report\Providers\ReportServiceProvider;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Storage;
use Tests\Concerns\InteractsWithPermissions;

uses(RefreshDatabase::class, InteractsWithPermissions::class);

beforeEach(function () {
    $this->app->register(ReportServiceProvider::class);
});

it('queues a private export without exposing its storage path', function () {
    Queue::fake();
    $tenant = Tenant::factory()->create();
    $branch = Branch::factory()->for($tenant)->create();
    $user = $this->userWithPermissions($tenant, ['reports.attendance.view', 'exports.create']);
    $user->branches()->attach($branch, ['is_primary' => true]);

    $response = $this->actingAs($user)->postJson('/api/v1/report-exports', [
        'report_key' => 'daily-attendance', 'format' => 'csv',
        'date_from' => now()->subDay()->toDateString(), 'date_to' => now()->toDateString(),
        'branch_id' => $branch->id,
    ])->assertCreated()->assertJsonMissingPath('data.file_path')->assertJsonMissingPath('data.disk');
    Queue::assertPushed(GenerateReportExportJob::class);
    expect(ReportExport::query()->find($response->json('data.id'))->status)->toBe('queued');
});

it('protects completed downloads by owner, tenant and expiration', function () {
    Storage::fake('local');
    $tenant = Tenant::factory()->create();
    $branch = Branch::factory()->for($tenant)->create();
    $user = $this->userWithPermissions($tenant, []);
    $user->branches()->attach($branch, ['is_primary' => true]);
    $export = ReportExport::withoutGlobalScopes()->create([
        'tenant_id' => $tenant->id, 'branch_id' => $branch->id, 'requested_by' => $user->id,
        'report_key' => 'sales', 'format' => 'csv', 'status' => 'completed',
        'disk' => 'local', 'file_path' => "report-exports/{$tenant->id}/file.csv",
        'expires_at' => now()->addHour(),
    ]);
    Storage::disk('local')->put($export->file_path, "amount\n100\n");

    $this->actingAs($user)->get("/api/v1/report-exports/{$export->id}/download")->assertOk();

    $other = Tenant::factory()->create();
    $otherUser = $this->userWithPermissions($other, ['exports.download-all']);
    $this->actingAs($otherUser)->get("/api/v1/report-exports/{$export->id}/download")->assertNotFound();
});

it('denies downloading an export past its expiration', function () {
    Storage::fake('local');
    $tenant = Tenant::factory()->create();
    $branch = Branch::factory()->for($tenant)->create();
    $user = $this->userWithPermissions($tenant, []);
    $user->branches()->attach($branch, ['is_primary' => true]);
    $export = ReportExport::withoutGlobalScopes()->create([
        'tenant_id' => $tenant->id, 'branch_id' => $branch->id, 'requested_by' => $user->id,
        'report_key' => 'sales', 'format' => 'csv', 'status' => 'completed',
        'disk' => 'local', 'file_path' => "report-exports/{$tenant->id}/expired.csv",
        'expires_at' => now()->subMinute(),
    ]);
    Storage::disk('local')->put($export->file_path, "amount\n100\n");

    $this->actingAs($user)->get("/api/v1/report-exports/{$export->id}/download")->assertStatus(410);
});

it('expires completed exports and removes their stored files via the cleanup command', function () {
    Storage::fake('local');
    $tenant = Tenant::factory()->create();
    $branch = Branch::factory()->for($tenant)->create();
    $user = $this->userWithPermissions($tenant, []);
    $path = "report-exports/{$tenant->id}/due.csv";
    Storage::disk('local')->put($path, "amount\n100\n");
    $due = ReportExport::withoutGlobalScopes()->create([
        'tenant_id' => $tenant->id, 'branch_id' => $branch->id, 'requested_by' => $user->id,
        'report_key' => 'sales', 'format' => 'csv', 'status' => 'completed',
        'disk' => 'local', 'file_path' => $path, 'expires_at' => now()->subMinute(),
    ]);
    $notDue = ReportExport::withoutGlobalScopes()->create([
        'tenant_id' => $tenant->id, 'branch_id' => $branch->id, 'requested_by' => $user->id,
        'report_key' => 'sales', 'format' => 'csv', 'status' => 'completed',
        'disk' => 'local', 'file_path' => "report-exports/{$tenant->id}/future.csv",
        'expires_at' => now()->addDay(),
    ]);

    Artisan::call('reports:expire-exports');

    expect($due->fresh()->status)->toBe('expired')
        ->and($due->fresh()->file_path)->toBeNull()
        ->and($due->fresh()->disk)->toBeNull();
    Storage::disk('local')->assertMissing($path);
    expect($notDue->fresh()->status)->toBe('completed');
});

it('allows retrying a failed export and denies retry to unrelated staff', function () {
    $tenant = Tenant::factory()->create();
    $branch = Branch::factory()->for($tenant)->create();
    $owner = $this->userWithPermissions($tenant, []);
    $owner->branches()->attach($branch, ['is_primary' => true]);
    $export = ReportExport::withoutGlobalScopes()->create([
        'tenant_id' => $tenant->id, 'branch_id' => $branch->id, 'requested_by' => $owner->id,
        'report_key' => 'sales', 'format' => 'csv', 'status' => 'failed',
        'failure_reason' => 'export_generation_failed',
    ]);
    Queue::fake();

    $this->actingAs($owner)->postJson("/api/v1/report-exports/{$export->id}/retry")
        ->assertOk()->assertJsonPath('data.status', 'queued');
    Queue::assertPushed(GenerateReportExportJob::class);
    expect($export->fresh()->failure_reason)->toBeNull();

    $completed = ReportExport::withoutGlobalScopes()->create([
        'tenant_id' => $tenant->id, 'branch_id' => $branch->id, 'requested_by' => $owner->id,
        'report_key' => 'sales', 'format' => 'csv', 'status' => 'completed', 'expires_at' => now()->addHour(),
    ]);
    $this->actingAs($owner)->postJson("/api/v1/report-exports/{$completed->id}/retry")->assertConflict();

    $unrelated = $this->userWithPermissions($tenant, []);
    $unrelated->branches()->attach($branch, ['is_primary' => true]);
    $another = ReportExport::withoutGlobalScopes()->create([
        'tenant_id' => $tenant->id, 'branch_id' => $branch->id, 'requested_by' => $owner->id,
        'report_key' => 'sales', 'format' => 'csv', 'status' => 'failed',
    ]);
    $this->actingAs($unrelated)->postJson("/api/v1/report-exports/{$another->id}/retry")->assertForbidden();
});
