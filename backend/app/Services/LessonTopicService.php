<?php

namespace App\Services;

use App\Models\LessonTopic;
use App\Models\SchoolClass;
use App\Models\Student;
use App\Models\Subject;
use App\Models\Teacher;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class LessonTopicService
{
    public function __construct(private readonly TeacherContextService $teacherContext)
    {
    }

    public function create(Teacher $teacher, int $subjectId, int $classId, string $title, ?string $description, string $date): LessonTopic
    {
        Subject::query()->findOrFail($subjectId);
        SchoolClass::query()->findOrFail($classId);

        if (! $teacher->subjects()->where('subjects.id', $subjectId)->exists()) {
            throw ValidationException::withMessages([
                'subject_id' => ['Teacher is not assigned to this subject.'],
            ]);
        }

        if ($teacher->is_main_teacher && $teacher->homeroomClass && $teacher->homeroomClass->id !== $classId) {
            throw ValidationException::withMessages([
                'class_id' => ['Main teacher can only add lesson topics for their own class.'],
            ]);
        }

        return DB::transaction(function () use ($teacher, $subjectId, $classId, $title, $description, $date) {
            return LessonTopic::query()->create([
                'teacher_id' => $teacher->id,
                'subject_id' => $subjectId,
                'class_id' => $classId,
                'title' => $title,
                'description' => $description,
                'date' => $date,
            ]);
        });
    }
}

