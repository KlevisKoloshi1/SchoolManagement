<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lesson_topics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('teacher_id')->constrained('teachers')->restrictOnDelete();
            $table->foreignId('subject_id')->constrained('subjects')->restrictOnDelete();
            $table->foreignId('class_id')->constrained('classes')->restrictOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->date('date')->index();
            $table->timestamps();

            $table->index('teacher_id');
            $table->index('subject_id');
            $table->index('class_id');
            $table->index(['class_id', 'subject_id', 'date']);
            $table->index(['teacher_id', 'subject_id', 'date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lesson_topics');
    }
};

