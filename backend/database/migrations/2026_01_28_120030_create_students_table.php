<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete()->unique();
            $table->foreignId('class_id')->constrained('classes')->restrictOnDelete()->index();
            $table->timestamps();

            $table->index(['class_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};

