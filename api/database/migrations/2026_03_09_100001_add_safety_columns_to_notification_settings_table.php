<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('notification_settings', function (Blueprint $table) {
            $table->boolean('gentle_mode')->default(false)->after('evening_time');
            $table->string('quiet_hours_start', 5)->default('22:00')->after('gentle_mode');
            $table->string('quiet_hours_end', 5)->default('08:00')->after('quiet_hours_start');
            $table->boolean('weekend_mode')->default(true)->after('quiet_hours_end');
        });
    }

    public function down(): void
    {
        Schema::table('notification_settings', function (Blueprint $table) {
            $table->dropColumn(['gentle_mode', 'quiet_hours_start', 'quiet_hours_end', 'weekend_mode']);
        });
    }
};
