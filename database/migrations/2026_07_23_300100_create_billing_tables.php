<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // The core cents-based billing ledger is created by 300001. These
        // tables extend it with the scheduling/allocation structures from dev.
        foreach (['invoice', 'payment', 'receipt', 'refund'] as $type) {
            Schema::create("{$type}_sequences", function (Blueprint $table) {
                $table->foreignId('tenant_id')->primary()->constrained()->cascadeOnDelete();
                $table->unsignedBigInteger('last_number')->default(0);
                $table->timestamps();
            });
        }

        Schema::create('payment_allocations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->foreignId('payment_id')->constrained()->restrictOnDelete();
            $table->foreignId('invoice_id')->constrained()->restrictOnDelete();
            $table->unsignedBigInteger('amount_cents');
            $table->timestamps();
            $table->unique(['payment_id', 'invoice_id']);
            $table->index(['tenant_id', 'invoice_id']);
        });

        Schema::create('installment_schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->foreignId('invoice_id')->constrained()->cascadeOnDelete();
            $table->unsignedSmallInteger('installment_number');
            $table->date('due_on');
            $table->unsignedBigInteger('amount_due_cents');
            $table->unsignedBigInteger('amount_paid_cents')->default(0);
            $table->string('status')->default('pending');
            $table->timestamps();
            $table->unique(['invoice_id', 'installment_number']);
            $table->index(['tenant_id', 'status', 'due_on']);
        });

        Schema::create('payment_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->foreignId('payment_id')->constrained()->restrictOnDelete();
            $table->string('event_type');
            $table->string('from_status')->nullable();
            $table->string('to_status')->nullable();
            $table->unsignedBigInteger('amount_cents')->nullable();
            $table->json('metadata')->nullable();
            $table->foreignId('actor_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('occurred_at');
            $table->index(['payment_id', 'occurred_at']);
            $table->index(['tenant_id', 'event_type', 'occurred_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payment_events');
        Schema::dropIfExists('installment_schedules');
        Schema::dropIfExists('payment_allocations');
        Schema::dropIfExists('refund_sequences');
        Schema::dropIfExists('receipt_sequences');
        Schema::dropIfExists('payment_sequences');
        Schema::dropIfExists('invoice_sequences');
    }
};
