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
    public function create(Teacher $teacher, int $studentId, int $subjectId, int $gradeValue, string $date, ?int $lessonTopicId = null): Grade
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

        if ($lessonTopicId !== null) {
            \App\Models\LessonTopic::query()
                ->where('id', $lessonTopicId)
                ->where('teacher_id', $teacher->id)
                ->where('subject_id', $subjectId)
                ->firstOrFail();
        }

        // Main teacher can act as simple teacher for other classes: allow any student when teacher has the subject.
        if ($teacher->is_main_teacher && $teacher->homeroomClass && $student->class_id !== $teacher->homeroomClass->id) {
            // Allow: main teacher may switch to another class and record grades there.
        }

        return DB::transaction(function () use ($teacher, $studentId, $subjectId, $gradeValue, $date, $lessonTopicId) {
            return Grade::query()->create([
                'student_id' => $studentId,
                'subject_id' => $subjectId,
                'teacher_id' => $teacher->id,
                'lesson_topic_id' => $lessonTopicId,
                'grade' => $gradeValue,
                'date' => $date,
            ]);
        });
    }
}

