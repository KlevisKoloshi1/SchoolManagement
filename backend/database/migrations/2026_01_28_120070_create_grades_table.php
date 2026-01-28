<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('grades', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->cascadeOnDelete()->index();
            $table->foreignId('subject_id')->constrained('subjects')->restrictOnDelete()->index();
            $table->foreignId('teacher_id')->constrained('teachers')->restrictOnDelete()->index();
            $table->unsignedSmallInteger('grade');
            $table->date('date')->index();
            $table->timestamps();

            $table->index(['student_id', 'subject_id', 'date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('grades');
    }
};

