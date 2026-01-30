<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (! Schema::hasColumn('users', 'role')) {
                // Nullable first to avoid breaking existing rows; backfilled below.
                $table->string('role')->nullable();
            }
        });

        if (Schema::hasColumn('users', 'role')) {
            DB::statement("
                UPDATE users
                SET role = 'student'
                WHERE role IS NULL OR role = ''
            ");
        }

        Schema::table('users', function (Blueprint $table) {
            try {
                $table->index('role');
            } catch (\Throwable) {
                // ignore
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            try {
                $table->dropIndex(['role']);
            } catch (\Throwable) {
                // ignore
            }
            if (Schema::hasColumn('users', 'role')) {
                $table->dropColumn('role');
            }
        });
    }
};

