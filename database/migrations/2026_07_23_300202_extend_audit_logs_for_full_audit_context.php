<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('audit_logs', function (Blueprint $table) {
            $table->foreignId('branch_id')->nullable()->after('tenant_id')->constrained()->nullOnDelete();
            $table->uuid('request_id')->nullable()->after('actor_id');
            $table->string('ip_address', 45)->nullable()->after('request_id');
            $table->text('user_agent')->nullable()->after('ip_address');
            $table->json('before_values')->nullable()->after('changes');
            $table->json('after_values')->nullable()->after('before_values');
            $table->json('context')->nullable()->after('after_values');

            $table->index(['tenant_id', 'action', 'created_at']);
            $table->index(['tenant_id', 'actor_id', 'created_at']);
            $table->index(['tenant_id', 'branch_id', 'created_at']);
            $table->index('request_id');
        });
    }

    public function down(): void
    {
        Schema::table('audit_logs', function (Blueprint $table) {
            $table->dropForeign(['branch_id']);
            $table->dropIndex(['tenant_id', 'action', 'created_at']);
            $table->dropIndex(['tenant_id', 'actor_id', 'created_at']);
            $table->dropIndex(['tenant_id', 'branch_id', 'created_at']);
            $table->dropIndex(['request_id']);
            $table->dropColumn([
                'branch_id',
                'request_id',
                'ip_address',
                'user_agent',
                'before_values',
                'after_values',
                'context',
            ]);
        });
    }
};
