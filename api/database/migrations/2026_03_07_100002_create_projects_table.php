<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('type'); // company, personal_startup, experiment, learning
            $table->string('status')->default('active'); // active, paused, completed, archived
            $table->text('vision')->nullable();
            $table->integer('priority')->default(3); // 1-5
            $table->string('repo_url', 500)->nullable();
            $table->date('start_date')->nullable();
            $table->date('target_date')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['user_id', 'status']);
            $table->index(['user_id', 'type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
