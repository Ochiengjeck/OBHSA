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
        Schema::create('credential_expiry_notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('credential_id')->constrained()->cascadeOnDelete();
            $table->string('stage');
            $table->timestamp('sent_at');
            $table->boolean('notified_employee')->default(false);
            $table->boolean('notified_staff')->default(false);
            $table->timestamps();

            $table->unique(['credential_id', 'stage']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('credential_expiry_notifications');
    }
};
