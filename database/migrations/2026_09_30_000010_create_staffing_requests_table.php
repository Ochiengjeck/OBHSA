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
        Schema::create('staffing_requests', function (Blueprint $table) {
            $table->id();
            $table->string('facility_name');
            $table->string('contact_name');
            $table->string('email');
            $table->string('phone');
            $table->string('facility_type')->nullable();
            $table->text('staffing_needs')->nullable();
            $table->string('status')->default('new');
            $table->foreignId('handled_by')->nullable()->constrained('users')->nullOnDelete();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('staffing_requests');
    }
};
