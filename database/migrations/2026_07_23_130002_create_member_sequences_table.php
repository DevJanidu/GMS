<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Backs tenant-scoped, gap-free member-number generation. One row per
 * tenant tracking the last number issued; incremented under a row lock.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('member_sequences', function (Blueprint $table) {
            $table->foreignId('tenant_id')->primary()->constrained()->cascadeOnDelete();
            $table->unsignedInteger('last_number')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('member_sequences');
    }
};
