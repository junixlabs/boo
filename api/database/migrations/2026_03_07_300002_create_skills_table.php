<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('skills', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('category_id')->constrained('skill_categories')->cascadeOnDelete();
            $table->string('name');
            $table->string('current_level')->default('beginner');
            $table->string('target_level')->default('advanced');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'category_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('skills');
    }
};
