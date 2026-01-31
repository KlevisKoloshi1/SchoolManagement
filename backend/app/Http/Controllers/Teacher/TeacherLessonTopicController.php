<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Http\Requests\Teacher\StoreLessonTopicRequest;
use App\Models\LessonTopic;
use App\Services\LessonTopicService;
use App\Services\TeacherContextService;
use Illuminate\Http\Request;

class TeacherLessonTopicController extends Controller
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

        $topics = $query->get();

        return response()->json([
            'lesson_topics' => $topics->map(fn ($t) => [
                'id' => $t->id,
                'title' => $t->title,
                'date' => $t->date->toDateString(),
                'subject_id' => $t->subject_id,
                'subject' => $t->subject ? ['id' => $t->subject->id, 'name' => $t->subject->name] : null,
            ]),
        ]);
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

