<?php

namespace App\Services;

use App\Models\Grade;
use App\Models\Student;
use App\Models\Subject;
use App\Models\Teacher;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class GradeService
{
    public function create(Teacher $teacher, int $studentId, int $subjectId, int $gradeValue, string $date): Grade
    {
        $student = Student::query()->with('class')->findOrFail($studentId);
        Subject::query()->findOrFail($subjectId);

        if ($gradeValue < 0 || $gradeValue > 100) {
            throw ValidationException::withMessages([
                'grade' => ['Grade must be between 0 and 100.'],
            ]);
        }

        if (! $teacher->subjects()->where('subjects.id', $subjectId)->exists()) {
            throw ValidationException::withMessages([
                'subject_id' => ['Teacher is not assigned to this subject.'],
            ]);
        }

        if ($teacher->is_main_teacher && $teacher->homeroomClass && $student->class_id !== $teacher->homeroomClass->id) {
            throw ValidationException::withMessages([
                'student_id' => ['Student is not in your class.'],
            ]);
        }

        return DB::transaction(function () use ($teacher, $studentId, $subjectId, $gradeValue, $date) {
            return Grade::query()->create([
                'student_id' => $studentId,
                'subject_id' => $subjectId,
                'teacher_id' => $teacher->id,
                'grade' => $gradeValue,
                'date' => $date,
            ]);
        });
    }
}

