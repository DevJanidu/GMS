<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('billing_sequences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->string('type', 32);
            $table->unsignedBigInteger('next_value')->default(1);
            $table->timestamps();
            $table->unique(['tenant_id', 'type']);
        });

        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->uuid('public_id')->unique();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->foreignId('branch_id')->constrained()->restrictOnDelete();
            $table->foreignId('member_id')->nullable()->constrained()->nullOnDelete();
            $table->unsignedBigInteger('membership_id')->nullable()->index();
            $table->string('invoice_number');
            $table->string('status', 32)->default('open');
            $table->char('currency', 3);
            $table->date('issued_on');
            $table->date('due_on')->nullable();
            $table->unsignedBigInteger('subtotal_cents');
            $table->string('discount_type', 16)->nullable();
            $table->unsignedBigInteger('discount_value')->default(0);
            $table->unsignedBigInteger('discount_cents')->default(0);
            $table->unsignedInteger('tax_rate_basis_points')->default(0);
            $table->unsignedBigInteger('tax_cents')->default(0);
            $table->unsignedBigInteger('joining_fee_cents')->default(0);
            $table->unsignedBigInteger('grand_total_cents');
            $table->unsignedBigInteger('amount_paid_cents')->default(0);
            $table->unsignedBigInteger('amount_refunded_cents')->default(0);
            $table->unsignedBigInteger('balance_due_cents');
            $table->text('notes')->nullable();
            $table->string('idempotency_key', 128)->nullable();
            $table->char('idempotency_hash', 64)->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('voided_at')->nullable();
            $table->foreignId('voided_by')->nullable()->constrained('users')->nullOnDelete();
            $table->text('void_reason')->nullable();
            $table->timestamps();

            $table->unique(['tenant_id', 'invoice_number']);
            $table->unique(['tenant_id', 'idempotency_key']);
            $table->index(['tenant_id', 'branch_id', 'status']);
            $table->index(['tenant_id', 'member_id']);
            $table->index(['tenant_id', 'due_on']);
        });

        Schema::create('invoice_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->foreignId('invoice_id')->constrained()->cascadeOnDelete();
            $table->string('description');
            $table->string('item_type', 32)->default('other');
            $table->unsignedInteger('quantity')->default(1);
            $table->unsignedBigInteger('unit_price_cents');
            $table->unsignedBigInteger('line_total_cents');
            $table->json('metadata')->nullable();
            $table->timestamps();
            $table->index(['tenant_id', 'invoice_id']);
        });

        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->uuid('public_id')->unique();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->foreignId('branch_id')->constrained()->restrictOnDelete();
            $table->foreignId('invoice_id')->constrained()->restrictOnDelete();
            $table->string('payment_number');
            $table->unsignedBigInteger('amount_cents');
            $table->string('method', 24);
            $table->string('reference')->nullable();
            $table->string('idempotency_key', 128);
            $table->json('metadata')->nullable();
            $table->timestamp('paid_at');
            $table->foreignId('recorded_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->unique(['tenant_id', 'payment_number']);
            $table->unique(['tenant_id', 'idempotency_key']);
            $table->index(['tenant_id', 'branch_id', 'paid_at']);
            $table->index(['tenant_id', 'invoice_id']);
        });

        Schema::create('refunds', function (Blueprint $table) {
            $table->id();
            $table->uuid('public_id')->unique();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->foreignId('branch_id')->constrained()->restrictOnDelete();
            $table->foreignId('invoice_id')->constrained()->restrictOnDelete();
            $table->foreignId('payment_id')->constrained()->restrictOnDelete();
            $table->string('refund_number');
            $table->unsignedBigInteger('amount_cents');
            $table->string('reason');
            $table->string('idempotency_key', 128);
            $table->json('metadata')->nullable();
            $table->timestamp('refunded_at');
            $table->foreignId('refunded_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->unique(['tenant_id', 'refund_number']);
            $table->unique(['tenant_id', 'idempotency_key']);
            $table->index(['tenant_id', 'branch_id', 'refunded_at']);
        });

        Schema::create('receipts', function (Blueprint $table) {
            $table->id();
            $table->uuid('public_id')->unique();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->foreignId('branch_id')->constrained()->restrictOnDelete();
            $table->foreignId('invoice_id')->constrained()->restrictOnDelete();
            $table->foreignId('payment_id')->unique()->constrained()->restrictOnDelete();
            $table->string('receipt_number');
            $table->json('snapshot');
            $table->timestamp('generated_at');
            $table->foreignId('generated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->unique(['tenant_id', 'receipt_number']);
        });

        Schema::create('billing_events', function (Blueprint $table) {
            $table->id();
            $table->uuid('event_id')->unique();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->foreignId('branch_id')->nullable()->constrained()->nullOnDelete();
            $table->string('event_type');
            $table->string('aggregate_type', 32);
            $table->unsignedBigInteger('aggregate_id');
            $table->json('payload');
            $table->timestamp('occurred_at');
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
            $table->index(['tenant_id', 'event_type', 'occurred_at']);
            $table->index(['aggregate_type', 'aggregate_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('billing_events');
        Schema::dropIfExists('receipts');
        Schema::dropIfExists('refunds');
        Schema::dropIfExists('payments');
        Schema::dropIfExists('invoice_items');
        Schema::dropIfExists('invoices');
        Schema::dropIfExists('billing_sequences');
    }
};
