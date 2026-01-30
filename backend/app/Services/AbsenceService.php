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
    public function create(Teacher $teacher, int $studentId, int $subjectId, string $date, bool $justified, ?int $lessonTopicId = null): Absence
    {
        $student = Student::query()->with('class')->findOrFail($studentId);
        Subject::query()->findOrFail($subjectId);

        if (! $teacher->subjects()->where('subjects.id', $subjectId)->exists()) {
            throw ValidationException::withMessages([
                'subject_id' => ['Teacher is not assigned to this subject.'],
            ]);
        }

        if ($lessonTopicId !== null) {
            $topic = \App\Models\LessonTopic::query()
                ->where('id', $lessonTopicId)
                ->where('teacher_id', $teacher->id)
                ->where('subject_id', $subjectId)
                ->firstOrFail();
        }

        // Main teacher can act as simple teacher for other classes: allow any student when teacher has the subject.
        if ($teacher->is_main_teacher && $teacher->homeroomClass && $student->class_id !== $teacher->homeroomClass->id) {
            // Allow: main teacher may switch to another class and record absences there.
        }

        return DB::transaction(function () use ($teacher, $studentId, $subjectId, $date, $justified, $lessonTopicId) {
            return Absence::query()->create([
                'student_id' => $studentId,
                'subject_id' => $subjectId,
                'teacher_id' => $teacher->id,
                'lesson_topic_id' => $lessonTopicId,
                'date' => $date,
                'justified' => $justified,
            ]);
        });
    }
}

