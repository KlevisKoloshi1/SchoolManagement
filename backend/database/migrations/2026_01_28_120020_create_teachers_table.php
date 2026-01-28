<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('teachers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete()->unique();
            $table->boolean('is_main_teacher')->default(false)->index();
            $table->timestamps();

            $table->index('user_id');
        });

        // Add FK to classes.main_teacher_id -> teachers.id after teachers table exists.
        Schema::table('classes', function (Blueprint $table) {
            $table->foreign('main_teacher_id')
                ->references('id')
                ->on('teachers')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('classes', function (Blueprint $table) {
            $table->dropForeign(['main_teacher_id']);
        });

        Schema::dropIfExists('teachers');
    }
};

