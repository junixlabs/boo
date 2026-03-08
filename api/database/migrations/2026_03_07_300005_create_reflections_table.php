<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('reflections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('type');
            $table->date('period_start');
            $table->date('period_end');
            $table->text('went_well')->nullable();
            $table->text('went_wrong')->nullable();
            $table->text('to_improve')->nullable();
            $table->text('projects_progress')->nullable();
            $table->text('skills_improved')->nullable();
            $table->text('mistakes')->nullable();
            $table->text('opportunities')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'type', 'period_start']);
            $table->index(['user_id', 'type', 'period_start']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reflections');
    }
};
