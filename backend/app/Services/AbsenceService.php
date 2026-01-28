<?php

namespace App\Services;

use App\Models\Absence;
use App\Models\Student;
use App\Models\Subject;
use App\Models\Teacher;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class AbsenceService
{
    public function create(Teacher $teacher, int $studentId, int $subjectId, string $date, bool $justified): Absence
    {
        $student = Student::query()->with('class')->findOrFail($studentId);
        Subject::query()->findOrFail($subjectId);

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

        return DB::transaction(function () use ($teacher, $studentId, $subjectId, $date, $justified) {
            return Absence::query()->create([
                'student_id' => $studentId,
                'subject_id' => $subjectId,
                'teacher_id' => $teacher->id,
                'date' => $date,
                'justified' => $justified,
            ]);
        });
    }
}

