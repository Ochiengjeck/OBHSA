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
        Schema::create('offers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('application_id')->constrained()->cascadeOnDelete();
            $table->string('position');
            $table->decimal('pay_rate', 8, 2);
            $table->string('employment_type');
            $table->date('start_date');
            $table->timestamp('expires_at')->nullable();
            $table->string('status')->default('pending');
            $table->foreignId('extended_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('extended_at')->nullable();
            $table->timestamp('responded_at')->nullable();
            $table->text('decline_reason')->nullable();
            $table->string('access_token')->nullable()->unique();
            $table->timestamp('access_token_expires_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('offers');
    }
};
