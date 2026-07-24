<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('notification_templates', function (Blueprint $table) {
            $table->foreignId('branch_id')->nullable()->after('tenant_id')
                ->constrained()->nullOnDelete();
            $table->index(['tenant_id', 'branch_id']);
        });

        Schema::table('notification_rules', function (Blueprint $table) {
            $table->foreignId('branch_id')->nullable()->after('tenant_id')
                ->constrained()->nullOnDelete();
            $table->index(['tenant_id', 'branch_id']);
        });

        Schema::table('notifications', function (Blueprint $table) {
            $table->foreignId('branch_id')->nullable()->after('tenant_id')
                ->constrained()->nullOnDelete();
            $table->index(['tenant_id', 'branch_id']);
        });

        Schema::table('announcements', function (Blueprint $table) {
            $table->foreignId('branch_id')->nullable()->after('tenant_id')
                ->constrained()->nullOnDelete();
            $table->index(['tenant_id', 'branch_id']);
        });

        Schema::table('notification_deliveries', function (Blueprint $table) {
            $table->foreignId('branch_id')->nullable()->after('tenant_id')
                ->constrained()->nullOnDelete();
            $table->index(['tenant_id', 'branch_id']);
        });

        Schema::table('audit_logs', function (Blueprint $table) {
            $table->string('entity_identifier')->nullable()->after('auditable_id');
            $table->index(['tenant_id', 'auditable_type', 'entity_identifier'], 'audit_entity_identifier_index');
        });

        Schema::table('memberships', function (Blueprint $table) {
            $table->index(['tenant_id', 'branch_id', 'sold_at'], 'memberships_report_sales_index');
            $table->index(['tenant_id', 'branch_id', 'expires_on'], 'memberships_report_expiry_index');
        });
    }

    public function down(): void
    {
        Schema::table('memberships', function (Blueprint $table) {
            $table->dropIndex('memberships_report_sales_index');
            $table->dropIndex('memberships_report_expiry_index');
        });

        Schema::table('audit_logs', function (Blueprint $table) {
            $table->dropIndex('audit_entity_identifier_index');
            $table->dropColumn('entity_identifier');
        });

        foreach ([
            'notification_deliveries',
            'announcements',
            'notifications',
            'notification_rules',
            'notification_templates',
        ] as $tableName) {
            Schema::table($tableName, function (Blueprint $table) {
                $table->dropForeign(['branch_id']);
                $table->dropIndex(['tenant_id', 'branch_id']);
                $table->dropColumn('branch_id');
            });
        }
    }
};
