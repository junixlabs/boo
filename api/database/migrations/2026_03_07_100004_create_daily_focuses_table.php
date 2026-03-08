<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('daily_focuses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('task_id')->constrained()->cascadeOnDelete();
            $table->date('focus_date');
            $table->integer('sort_order'); // 1-3
            $table->text('note')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'task_id', 'focus_date']);
            $table->index(['user_id', 'focus_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('daily_focuses');
    }
};
