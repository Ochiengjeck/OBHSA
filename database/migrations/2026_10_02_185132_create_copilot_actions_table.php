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
        Schema::create('copilot_actions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('copilot_conversation_id')->constrained()->cascadeOnDelete();
            $table->foreignId('copilot_message_id')->nullable()->constrained()->nullOnDelete();
            $table->string('tool_name');
            $table->json('arguments');
            $table->string('status')->default('pending_confirmation');
            $table->json('result')->nullable();
            $table->string('provider');
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->timestamp('executed_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('copilot_actions');
    }
};
