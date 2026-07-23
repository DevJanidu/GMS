<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Add this as nullable first so databases such as SQLite can apply
            // the migration when the users table already contains records.
            $table->foreignId('tenant_id')->nullable()->after('id')->constrained()->cascadeOnDelete();
            $table->string('status')->default('active')->after('password');
        });

        if (DB::table('users')->whereNull('tenant_id')->exists()) {
            $tenantId = DB::table('tenants')->value('id');

            if ($tenantId === null) {
                $tenantId = DB::table('tenants')->insertGetId([
                    'name' => 'Default Gym',
                    'slug' => 'default-gym',
                    'status' => 'active',
                    'timezone' => 'UTC',
                    'currency' => 'USD',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            DB::table('users')->whereNull('tenant_id')->update(['tenant_id' => $tenantId]);
        }

        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('tenant_id')->nullable(false)->change();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropConstrainedForeignId('tenant_id');
            $table->dropColumn('status');
        });
    }
};
