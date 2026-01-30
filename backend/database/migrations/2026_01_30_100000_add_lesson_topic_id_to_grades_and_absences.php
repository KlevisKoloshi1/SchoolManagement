<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('grades', function (Blueprint $table) {
            $table->foreignId('lesson_topic_id')->nullable()->after('teacher_id')->constrained('lesson_topics')->nullOnDelete();
        });

        Schema::table('absences', function (Blueprint $table) {
            $table->foreignId('lesson_topic_id')->nullable()->after('teacher_id')->constrained('lesson_topics')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('grades', function (Blueprint $table) {
            $table->dropForeign(['lesson_topic_id']);
        });
        Schema::table('absences', function (Blueprint $table) {
            $table->dropForeign(['lesson_topic_id']);
        });
    }
};
