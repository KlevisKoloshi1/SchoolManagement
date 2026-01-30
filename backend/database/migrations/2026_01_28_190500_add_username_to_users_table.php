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
            if (! Schema::hasColumn('users', 'username')) {
                // Nullable to avoid breaking existing rows; we'll backfill below.
                $table->string('username')->nullable();
            }
        });

        // Backfill any existing users with a deterministic username.
        // Uses the local-part of email; if duplicates exist, we'll append the user id.
        if (Schema::hasColumn('users', 'username')) {
            DB::statement("
                UPDATE users
                SET username = split_part(email, '@', 1)
                WHERE username IS NULL OR username = ''
            ");

            DB::statement("
                UPDATE users u
                SET username = u.username || '_' || u.id
                WHERE EXISTS (
                    SELECT 1
                    FROM users x
                    WHERE x.username = u.username
                      AND x.id <> u.id
                )
            ");
        }

        // Add a unique constraint if it doesn't exist yet.
        Schema::table('users', function (Blueprint $table) {
            // Laravel cannot reliably introspect existing unique constraints across DBs,
            // so we attempt to create it and let the DB error if it already exists.
            try {
                $table->unique('username');
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
                $table->dropUnique(['username']);
            } catch (\Throwable) {
                // ignore
            }
            if (Schema::hasColumn('users', 'username')) {
                $table->dropColumn('username');
            }
        });
    }
};

