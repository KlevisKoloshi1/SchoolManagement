<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('classes', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();

            // Assigned homeroom (main) teacher (enforced via services + unique index)
            $table->foreignId('main_teacher_id')->nullable()->unique();

            $table->timestamps();

            $table->index('main_teacher_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('classes');
    }
};

