<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('announcements', function (Blueprint $table) {
            $table->id();
            $table->string('type'); // cancelled, postponed
            $table->string('title');
            $table->text('message');
            $table->foreignId('subject_id')->nullable()->constrained('subjects')->nullOnDelete();
            $table->boolean('for_all_classes')->default(false);
            $table->timestamps();
        });

        Schema::create('announcement_class', function (Blueprint $table) {
            $table->id();
            $table->foreignId('announcement_id')->constrained('announcements')->cascadeOnDelete();
            $table->foreignId('class_id')->constrained('classes')->cascadeOnDelete();
            $table->unique(['announcement_id', 'class_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('announcement_class');
        Schema::dropIfExists('announcements');
    }
};
