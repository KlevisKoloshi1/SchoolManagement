<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Http\Requests\Teacher\StoreLessonTopicRequest;
use App\Services\LessonTopicService;
use App\Services\TeacherContextService;

class TeacherLessonTopicController extends Controller
{
    public function __construct(
        private readonly TeacherContextService $teacherContext,
        private readonly LessonTopicService $lessonTopicService,
    ) {
    }

    public function store(StoreLessonTopicRequest $request)
    {
        $teacher = $this->teacherContext->getTeacherOrFail($request->user());

        $lessonTopic = $this->lessonTopicService->create(
            teacher: $teacher,
            subjectId: (int) $request->validated('subject_id'),
            classId: (int) $request->validated('class_id'),
            title: $request->validated('title'),
            description: $request->validated('description'),
            date: $request->validated('date'),
        );

        return response()->json([
            'message' => 'Lesson topic created.',
            'lesson_topic' => $lessonTopic,
        ], 201);
    }
}

