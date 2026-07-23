<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Append-only membership history. Rows are never updated or deleted
        // (enforced in the MembershipEvent model), so this table is the
        // authoritative audit trail for every status change a membership
        // ever goes through.
        Schema::create('membership_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->foreignId('membership_id')->constrained()->cascadeOnDelete();
            $table->string('type');
            $table->string('from_status')->nullable();
            $table->string('to_status')->nullable();
            $table->timestamp('occurred_at');
            $table->foreignId('actor_id')->nullable()->constrained('users')->nullOnDelete();
            $table->json('metadata')->nullable();
            $table->timestamp('created_at')->nullable();

            $table->index(['tenant_id', 'membership_id']);
            $table->index(['membership_id', 'occurred_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('membership_events');
    }
};
