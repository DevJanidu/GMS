<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('memberships', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->foreignId('branch_id')->constrained()->restrictOnDelete();
            $table->foreignId('member_id')->constrained()->restrictOnDelete();
            $table->foreignId('plan_id')->nullable()->constrained()->nullOnDelete();

            // Plan/price snapshot at time of sale, so later plan edits never
            // rewrite what a member actually bought.
            $table->string('plan_name_snapshot');
            $table->decimal('plan_price_snapshot', 10, 2);
            $table->decimal('plan_joining_fee_snapshot', 10, 2)->default(0);
            $table->unsignedInteger('plan_duration_value_snapshot');
            $table->string('plan_duration_unit_snapshot');
            $table->json('plan_access_rules_snapshot')->nullable();

            $table->date('starts_on');
            $table->date('expires_on');
            $table->unsignedInteger('grace_days')->default(0);
            $table->date('grace_ends_on');
            $table->string('status')->default('pending');

            // Renewal chain: the membership this one renews, if any.
            $table->foreignId('previous_membership_id')->nullable()
                ->constrained('memberships')->nullOnDelete();

            $table->foreignId('sold_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('sold_at')->nullable();

            // Billing owns the invoices table; this module never writes to it
            // directly (see InvoiceCreator contract), so this is a plain
            // reference id, not a cross-module foreign key.
            $table->unsignedBigInteger('invoice_id')->nullable();

            $table->date('freeze_started_on')->nullable();
            $table->date('freeze_resumes_on')->nullable();
            $table->unsignedInteger('frozen_days_used')->default(0);

            $table->timestamp('suspended_at')->nullable();
            $table->string('suspension_reason')->nullable();

            $table->timestamp('cancelled_at')->nullable();
            $table->string('cancellation_reason')->nullable();

            $table->timestamp('expiring_notified_at')->nullable();
            $table->timestamp('expired_at')->nullable();

            $table->text('notes')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();

            $table->timestamps();

            $table->index(['tenant_id', 'status']);
            $table->index(['tenant_id', 'member_id']);
            $table->index(['tenant_id', 'expires_on']);
            $table->index(['tenant_id', 'branch_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('memberships');
    }
};
