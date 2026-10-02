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
        Schema::create('reference_checks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employment_history_id')->constrained('employment_history')->cascadeOnDelete();
            $table->string('contact_method');
            $table->timestamp('contacted_at');
            $table->string('outcome');
            $table->text('notes')->nullable();
            $table->foreignId('checked_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reference_checks');
    }
};
