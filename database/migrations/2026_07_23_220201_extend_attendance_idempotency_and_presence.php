<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('attendance_records', function (Blueprint $table) {
            $table->string('request_hash', 64)->nullable()->after('request_id');
            $table->string('open_presence_key')->nullable()->after('status');
            $table->unique('open_presence_key');
        });

        Schema::table('attendance_scan_logs', function (Blueprint $table) {
            $table->string('request_hash', 64)->nullable()->after('request_id');
        });

        Schema::table('attendance_corrections', function (Blueprint $table) {
            $table->uuid('request_id')->nullable()->after('attendance_record_id');
            $table->string('request_hash', 64)->nullable()->after('request_id');
            $table->unique(['tenant_id', 'request_id']);
        });
    }

    public function down(): void
    {
        Schema::table('attendance_corrections', function (Blueprint $table) {
            $table->dropUnique(['tenant_id', 'request_id']);
            $table->dropColumn(['request_id', 'request_hash']);
        });

        Schema::table('attendance_scan_logs', function (Blueprint $table) {
            $table->dropColumn('request_hash');
        });

        Schema::table('attendance_records', function (Blueprint $table) {
            $table->dropUnique(['open_presence_key']);
            $table->dropColumn(['request_hash', 'open_presence_key']);
        });
    }
};
