<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('member_qr_credentials', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->foreignId('member_id')->constrained()->cascadeOnDelete();
            $table->uuid('public_id')->unique();
            $table->string('token_hash', 64)->unique();
            $table->timestamp('issued_at');
            $table->timestamp('expires_at')->nullable();
            $table->timestamp('revoked_at')->nullable();
            $table->foreignId('issued_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index(['tenant_id', 'member_id', 'revoked_at']);
        });

        Schema::create('attendance_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->foreignId('branch_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('mode')->default('check_in_only');
            $table->unsignedInteger('duplicate_window_seconds')->default(60);
            $table->boolean('allow_manual_entry')->default(true);
            $table->boolean('manager_override_required')->default(true);
            $table->json('visit_limit_rules')->nullable();
            $table->timestamps();

            $table->index(['tenant_id', 'mode']);
        });

        Schema::create('attendance_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->foreignId('branch_id')->constrained()->restrictOnDelete();
            $table->foreignId('member_id')->constrained()->restrictOnDelete();
            $table->foreignId('membership_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('qr_credential_id')->nullable()->constrained('member_qr_credentials')->nullOnDelete();
            $table->uuid('request_id');
            $table->string('status')->default('checked_in');
            $table->string('source');
            $table->timestamp('checked_in_at');
            $table->timestamp('checked_out_at')->nullable();
            $table->string('device_id')->nullable();
            $table->foreignId('recorded_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('override_by')->nullable()->constrained('users')->nullOnDelete();
            $table->text('override_reason')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->unique(['tenant_id', 'request_id']);
            $table->index(['branch_id', 'checked_in_at', 'checked_out_at']);
            $table->index(['member_id', 'checked_in_at']);
            $table->index(['tenant_id', 'status', 'checked_in_at']);
        });

        Schema::create('attendance_scan_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->foreignId('branch_id')->constrained()->restrictOnDelete();
            $table->foreignId('member_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('membership_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('attendance_record_id')->nullable()->constrained()->nullOnDelete();
            $table->uuid('request_id');
            $table->string('result');
            $table->string('reason_code')->nullable();
            $table->text('reason')->nullable();
            $table->string('source');
            $table->string('device_id')->nullable();
            $table->foreignId('scanned_by')->nullable()->constrained('users')->nullOnDelete();
            $table->json('context')->nullable();
            $table->timestamp('scanned_at');

            $table->unique(['tenant_id', 'request_id']);
            $table->index(['branch_id', 'result', 'scanned_at']);
            $table->index(['member_id', 'scanned_at']);
        });

        Schema::create('attendance_corrections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->foreignId('attendance_record_id')->constrained()->restrictOnDelete();
            $table->string('correction_type');
            $table->json('before_values');
            $table->json('after_values');
            $table->text('reason');
            $table->foreignId('corrected_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('corrected_at');

            $table->index(['tenant_id', 'corrected_at']);
            $table->index(['attendance_record_id', 'corrected_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attendance_corrections');
        Schema::dropIfExists('attendance_scan_logs');
        Schema::dropIfExists('attendance_records');
        Schema::dropIfExists('attendance_settings');
        Schema::dropIfExists('member_qr_credentials');
    }
};
