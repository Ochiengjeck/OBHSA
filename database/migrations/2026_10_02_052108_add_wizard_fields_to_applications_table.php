<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('applications', function (Blueprint $table) {
            $table->string('primary_specialty')->nullable()->after('cover_note');
            $table->string('secondary_specialty')->nullable()->after('primary_specialty');
            $table->string('desired_employment_type')->nullable()->after('secondary_specialty');
            $table->string('desired_start_timeframe')->nullable()->after('desired_employment_type');
            $table->json('work_settings')->nullable()->after('desired_start_timeframe');
            $table->timestamp('consent_accepted_at')->nullable()->after('work_settings');
            $table->string('consent_signature_name')->nullable()->after('consent_accepted_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('applications', function (Blueprint $table) {
            $table->dropColumn([
                'primary_specialty',
                'secondary_specialty',
                'desired_employment_type',
                'desired_start_timeframe',
                'work_settings',
                'consent_accepted_at',
                'consent_signature_name',
            ]);
        });
    }
};
