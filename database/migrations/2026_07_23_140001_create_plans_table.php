<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('plans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('slug');
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2);
            $table->decimal('joining_fee', 10, 2)->default(0);
            $table->unsignedInteger('duration_value');
            $table->string('duration_unit');
            $table->json('access_rules')->nullable();
            $table->boolean('available_at_all_branches')->default(true);
            $table->string('status')->default('active');
            $table->foreignId('cloned_from_id')->nullable()->constrained('plans')->nullOnDelete();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->unique(['tenant_id', 'slug']);
            $table->index(['tenant_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('plans');
    }
};
