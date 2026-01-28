<?php

namespace App\Services;

use App\Models\SchoolClass;
use App\Models\Subject;
use App\Models\Teacher;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class AssignmentService
{
    public function assignMainTeacherToClass(int $teacherId, int $classId): SchoolClass
    {
        return DB::transaction(function () use ($teacherId, $classId) {
            $teacher = Teacher::query()->with('user')->findOrFail($teacherId);
            $class = SchoolClass::query()->findOrFail($classId);

            if (! $teacher->is_main_teacher || $teacher->user->role !== 'main_teacher') {
                throw ValidationException::withMessages([
                    'teacher_id' => ['Teacher must be a main teacher.'],
                ]);
            }

            // One homeroom per teacher, and one homeroom teacher per class.
            if (SchoolClass::query()->where('main_teacher_id', $teacher->id)->where('id', '!=', $class->id)->exists()) {
                throw ValidationException::withMessages([
                    'teacher_id' => ['This main teacher is already assigned to another class.'],
                ]);
            }

            $class->main_teacher_id = $teacher->id;
            $class->save();

            return $class->fresh(['mainTeacher.user']);
        });
    }

    public function assignSubjectToTeacher(int $teacherId, int $subjectId): void
    {
        $teacher = Teacher::query()->findOrFail($teacherId);
        Subject::query()->findOrFail($subjectId);

        $teacher->subjects()->syncWithoutDetaching([$subjectId]);
    }
}

