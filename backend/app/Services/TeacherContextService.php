<?php

namespace App\Services;

use App\Models\Teacher;
use App\Models\User;
use Illuminate\Validation\ValidationException;

class TeacherContextService
{
    public function getTeacherOrFail(User $user): Teacher
    {
        $teacher = $user->teacher;

        if (! $teacher) {
            throw ValidationException::withMessages([
                'teacher' => ['Teacher profile not found.'],
            ]);
        }

        return $teacher;
    }
}

