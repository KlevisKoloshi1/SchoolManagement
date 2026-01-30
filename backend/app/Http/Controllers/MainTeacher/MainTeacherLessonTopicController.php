<?php

namespace App\Http\Controllers\MainTeacher;

use App\Http\Controllers\Controller;
use App\Http\Requests\MainTeacher\StoreLessonTopicRequest;
use App\Models\LessonTopic;
use App\Services\LessonTopicService;
use App\Services\TeacherContextService;
use Illuminate\Http\Request;

class MainTeacherLessonTopicController extends Controller
{
    public function __construct(
        private readonly TeacherContextService $teacherContext,
        private readonly LessonTopicService $lessonTopicService,
    ) {
    }

    public function index(Request $request)
    {
        $teacher = $this->teacherContext->getTeacherOrFail($request->user());
        $subjectId = $request->query('subject_id') ? (int) $request->query('subject_id') : null;
        $classId = $request->query('class_id') ? (int) $request->query('class_id') : null;

        $query = LessonTopic::query()
            ->where('teacher_id', $teacher->id)
            ->with('subject:id,name')
            ->orderByDesc('date')
            ->orderBy('title');

        if ($subjectId !== null) {
            $query->where('subject_id', $subjectId);
        }
        if ($classId !== null) {
            $query->where('class_id', $classId);
        }

        $topics = $query->get(['id', 'subject_id', 'class_id', 'title', 'date']);

        return response()->json([
            'lesson_topics' => $topics->map(fn ($t) => [
                'id' => $t->id,
                'title' => $t->title,
                'date' => $t->date->toDateString(),
                'subject_id' => $t->subject_id,
            ]),
        ]);
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

