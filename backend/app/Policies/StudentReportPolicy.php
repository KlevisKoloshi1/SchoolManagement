<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\LessonTopic;
use App\Models\Student;
use App\Models\User;

class StudentReportPolicy
{
    /**
     * Determine whether the user can view the student's performance report.
     */
    public function view(User $user, Student $student): bool
    {
        if ($user->role === UserRole::Admin->value) {
            return true;
        }

        if ($user->student && (int) $user->student->id === (int) $student->id) {
            return true;
        }

        $teacher = $user->teacher;
        if (! $teacher) {
            return false;
        }

        if ($teacher->homeroomClass && (int) $teacher->homeroomClass->id === (int) $student->class_id) {
            return true;
        }

        return LessonTopic::query()
            ->where('teacher_id', $teacher->id)
            ->where('class_id', $student->class_id)
            ->exists();
    }

    public function viewReport(User $user, Student $student): bool
{
    return $user->hasRole('admin')
        || $user->hasRole('main_teacher')
        || (
            $user->hasRole('teacher') &&
            $user->teachesStudent($student)
        )
        || (
            $user->hasRole('student') &&
            $student->user_id === $user->id
        );
}

}
