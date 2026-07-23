<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Append-only ledger of a plan's price over time so a membership sold
 * under an earlier price (phase 2) can still resolve the price that
 * applied on its start date, even after the plan's current price changes.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('plan_price_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('plan_id')->constrained()->cascadeOnDelete();
            $table->decimal('price', 10, 2);
            $table->decimal('joining_fee', 10, 2);
            $table->timestamp('effective_from');
            $table->timestamp('effective_until')->nullable();
            $table->foreignId('changed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index(['plan_id', 'effective_from']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('plan_price_histories');
    }
};
