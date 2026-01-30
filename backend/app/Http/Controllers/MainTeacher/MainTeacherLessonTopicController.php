<?php

namespace App\Http\Controllers\MainTeacher;

use App\Http\Controllers\Controller;
use App\Http\Requests\MainTeacher\StoreLessonTopicRequest;
use App\Services\LessonTopicService;
use App\Services\TeacherContextService;

class MainTeacherLessonTopicController extends Controller
{
    public function __construct(
        private readonly TeacherContextService $teacherContext,
        private readonly LessonTopicService $lessonTopicService,
    ) {
    }

    public function store(StoreLessonTopicRequest $request)
    {
        $teacher = $this->teacherContext->getTeacherOrFail($request->user());
        $validated = $request->validated();
        $classId = isset($validated['class_id'])
            ? (int) $validated['class_id']
            : ($teacher->homeroomClass?->id);

        if ($classId === null) {
            return response()->json([
                'message' => 'Main teacher is not assigned to a class, or class_id is required.',
            ], 422);
        }

        $lessonTopic = $this->lessonTopicService->create(
            teacher: $teacher,
            subjectId: (int) $validated['subject_id'],
            classId: $classId,
            title: $validated['title'],
            description: $validated['description'] ?? null,
            date: $validated['date'],
        );

        return response()->json([
            'message' => 'Lesson topic created.',
            'lesson_topic' => $lessonTopic,
        ], 201);
    }
}

