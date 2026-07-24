<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Attendance's foundation migration predates Membership's migration in the
 * approved shared history. This Attendance-owned follow-up keeps fresh MySQL
 * and PostgreSQL migrations valid while preserving referential integrity
 * after the memberships table exists.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('attendance_records', function (Blueprint $table) {
            $table->foreign('membership_id')
                ->references('id')
                ->on('memberships')
                ->nullOnDelete();
        });

        Schema::table('attendance_scan_logs', function (Blueprint $table) {
            $table->foreign('membership_id')
                ->references('id')
                ->on('memberships')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('attendance_scan_logs', function (Blueprint $table) {
            $table->dropForeign(['membership_id']);
        });

        Schema::table('attendance_records', function (Blueprint $table) {
            $table->dropForeign(['membership_id']);
        });
    }
};
