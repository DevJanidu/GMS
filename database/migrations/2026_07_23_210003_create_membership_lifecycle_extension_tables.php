<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('membership_status_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->foreignId('membership_id')->constrained()->restrictOnDelete();
            $table->string('event_type');
            $table->string('from_status')->nullable();
            $table->string('to_status');
            $table->text('reason')->nullable();
            $table->timestamp('effective_at');
            $table->foreignId('actor_id')->nullable()->constrained('users')->nullOnDelete();
            $table->json('metadata')->nullable();
            $table->timestamps();
            $table->index(['tenant_id', 'event_type', 'effective_at'], 'membership_status_histories_tenant_event_effective_idx');
            $table->index(['membership_id', 'effective_at']);
        });

        Schema::create('membership_freezes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->foreignId('membership_id')->constrained()->restrictOnDelete();
            $table->string('status')->default('scheduled');
            $table->date('starts_on');
            $table->date('ends_on')->nullable();
            $table->timestamp('resumed_at')->nullable();
            $table->unsignedInteger('extension_days')->default(0);
            $table->text('reason')->nullable();
            $table->foreignId('requested_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->index(['tenant_id', 'status', 'starts_on']);
            $table->index(['membership_id', 'starts_on', 'ends_on']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('membership_freezes');
        Schema::dropIfExists('membership_status_histories');
    }
};
