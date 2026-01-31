<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('activities', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->date('date');
            $table->text('description')->nullable();
            $table->boolean('for_all_classes')->default(false);
            $table->timestamps();
        });

        Schema::create('activity_class', function (Blueprint $table) {
            $table->id();
            $table->foreignId('activity_id')->constrained('activities')->cascadeOnDelete();
            $table->foreignId('class_id')->constrained('classes')->cascadeOnDelete();
            $table->unique(['activity_id', 'class_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activity_class');
        Schema::dropIfExists('activities');
    }
};
