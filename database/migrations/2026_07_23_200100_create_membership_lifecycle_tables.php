<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('membership_sequences', function (Blueprint $table) {
            $table->foreignId('tenant_id')->primary()->constrained()->cascadeOnDelete();
            $table->unsignedBigInteger('last_number')->default(0);
            $table->timestamps();
        });

        Schema::create('memberships', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->foreignId('member_id')->constrained()->restrictOnDelete();
            $table->foreignId('plan_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('branch_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('renewed_from_id')->nullable()->constrained('memberships')->nullOnDelete();
            $table->string('membership_number');
            $table->string('status')->default('pending');
            $table->char('currency', 3);
            $table->decimal('plan_price', 12, 2);
            $table->decimal('joining_fee', 12, 2)->default(0);
            $table->decimal('discount_amount', 12, 2)->default(0);
            $table->decimal('tax_amount', 12, 2)->default(0);
            $table->decimal('total_amount', 12, 2);
            $table->date('starts_on');
            $table->date('ends_on');
            $table->date('grace_ends_on')->nullable();
            $table->timestamp('sold_at')->nullable();
            $table->timestamp('activated_at')->nullable();
            $table->timestamp('terminated_at')->nullable();
            $table->json('plan_snapshot');
            $table->json('access_rules_snapshot')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->unique(['tenant_id', 'membership_number']);
            $table->index(['tenant_id', 'status', 'ends_on']);
            $table->index(['member_id', 'starts_on', 'ends_on']);
            $table->index(['branch_id', 'status']);
        });

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

            $table->index(['tenant_id', 'event_type', 'effective_at']);
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
        Schema::dropIfExists('memberships');
        Schema::dropIfExists('membership_sequences');
    }
};
