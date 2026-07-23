<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('invoice_sequences', function (Blueprint $table) {
            $table->foreignId('tenant_id')->primary()->constrained()->cascadeOnDelete();
            $table->unsignedBigInteger('last_number')->default(0);
            $table->timestamps();
        });

        Schema::create('payment_sequences', function (Blueprint $table) {
            $table->foreignId('tenant_id')->primary()->constrained()->cascadeOnDelete();
            $table->unsignedBigInteger('last_number')->default(0);
            $table->timestamps();
        });

        Schema::create('receipt_sequences', function (Blueprint $table) {
            $table->foreignId('tenant_id')->primary()->constrained()->cascadeOnDelete();
            $table->unsignedBigInteger('last_number')->default(0);
            $table->timestamps();
        });

        Schema::create('refund_sequences', function (Blueprint $table) {
            $table->foreignId('tenant_id')->primary()->constrained()->cascadeOnDelete();
            $table->unsignedBigInteger('last_number')->default(0);
            $table->timestamps();
        });

        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->foreignId('branch_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('member_id')->constrained()->restrictOnDelete();
            $table->foreignId('membership_id')->nullable()->constrained()->nullOnDelete();
            $table->string('invoice_number');
            $table->string('status')->default('draft');
            $table->char('currency', 3);
            $table->date('issued_on');
            $table->date('due_on')->nullable();
            $table->decimal('subtotal', 12, 2);
            $table->decimal('discount_amount', 12, 2)->default(0);
            $table->decimal('tax_amount', 12, 2)->default(0);
            $table->decimal('grand_total', 12, 2);
            $table->decimal('amount_paid', 12, 2)->default(0);
            $table->decimal('balance_due', 12, 2);
            $table->string('idempotency_key')->nullable();
            $table->text('notes')->nullable();
            $table->timestamp('voided_at')->nullable();
            $table->foreignId('voided_by')->nullable()->constrained('users')->nullOnDelete();
            $table->text('void_reason')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->unique(['tenant_id', 'invoice_number']);
            $table->unique(['tenant_id', 'idempotency_key']);
            $table->index(['tenant_id', 'status', 'due_on']);
            $table->index(['member_id', 'issued_on']);
        });

        Schema::create('invoice_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->foreignId('invoice_id')->constrained()->cascadeOnDelete();
            $table->nullableMorphs('itemable');
            $table->string('item_type');
            $table->string('description');
            $table->decimal('quantity', 10, 2)->default(1);
            $table->decimal('unit_price', 12, 2);
            $table->decimal('discount_amount', 12, 2)->default(0);
            $table->decimal('tax_amount', 12, 2)->default(0);
            $table->decimal('line_total', 12, 2);
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index(['tenant_id', 'item_type']);
        });

        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->foreignId('branch_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('member_id')->constrained()->restrictOnDelete();
            $table->string('payment_number');
            $table->string('method');
            $table->string('status')->default('pending');
            $table->char('currency', 3);
            $table->decimal('amount', 12, 2);
            $table->timestamp('paid_at')->nullable();
            $table->string('external_reference')->nullable();
            $table->string('idempotency_key');
            $table->foreignId('received_by')->nullable()->constrained('users')->nullOnDelete();
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->unique(['tenant_id', 'payment_number']);
            $table->unique(['tenant_id', 'idempotency_key']);
            $table->index(['tenant_id', 'status', 'paid_at']);
            $table->index(['branch_id', 'paid_at']);
        });

        Schema::create('payment_allocations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->foreignId('payment_id')->constrained()->restrictOnDelete();
            $table->foreignId('invoice_id')->constrained()->restrictOnDelete();
            $table->decimal('amount', 12, 2);
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
            $table->decimal('amount_due', 12, 2);
            $table->decimal('amount_paid', 12, 2)->default(0);
            $table->string('status')->default('pending');
            $table->timestamps();

            $table->unique(['invoice_id', 'installment_number']);
            $table->index(['tenant_id', 'status', 'due_on']);
        });

        Schema::create('refunds', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->foreignId('payment_id')->constrained()->restrictOnDelete();
            $table->string('refund_number');
            $table->string('status')->default('pending');
            $table->decimal('amount', 12, 2);
            $table->text('reason');
            $table->string('external_reference')->nullable();
            $table->string('idempotency_key');
            $table->timestamp('refunded_at')->nullable();
            $table->foreignId('processed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->unique(['tenant_id', 'refund_number']);
            $table->unique(['tenant_id', 'idempotency_key']);
            $table->index(['tenant_id', 'status', 'refunded_at']);
        });

        Schema::create('receipts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->foreignId('payment_id')->nullable()->constrained()->restrictOnDelete();
            $table->foreignId('refund_id')->nullable()->constrained()->restrictOnDelete();
            $table->string('receipt_number');
            $table->string('type')->default('payment');
            $table->timestamp('issued_at');
            $table->foreignId('issued_by')->nullable()->constrained('users')->nullOnDelete();
            $table->string('file_path')->nullable();
            $table->json('snapshot');
            $table->timestamps();

            $table->unique(['tenant_id', 'receipt_number']);
            $table->index(['tenant_id', 'issued_at']);
        });

        Schema::create('payment_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->foreignId('payment_id')->constrained()->restrictOnDelete();
            $table->string('event_type');
            $table->string('from_status')->nullable();
            $table->string('to_status')->nullable();
            $table->decimal('amount', 12, 2)->nullable();
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
        Schema::dropIfExists('receipts');
        Schema::dropIfExists('refunds');
        Schema::dropIfExists('installment_schedules');
        Schema::dropIfExists('payment_allocations');
        Schema::dropIfExists('payments');
        Schema::dropIfExists('invoice_items');
        Schema::dropIfExists('invoices');
        Schema::dropIfExists('refund_sequences');
        Schema::dropIfExists('receipt_sequences');
        Schema::dropIfExists('payment_sequences');
        Schema::dropIfExists('invoice_sequences');
    }
};
