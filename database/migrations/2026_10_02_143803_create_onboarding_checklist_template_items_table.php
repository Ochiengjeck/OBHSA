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
        Schema::create('onboarding_checklist_template_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('onboarding_checklist_template_id')->constrained('onboarding_checklist_templates')->cascadeOnDelete();
            $table->string('task_key');
            $table->string('label');
            $table->boolean('is_blocking')->default(true);
            $table->unsignedInteger('position')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('onboarding_checklist_template_items');
    }
};
