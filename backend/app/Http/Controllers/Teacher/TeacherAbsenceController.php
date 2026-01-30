<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Http\Requests\Teacher\StoreAbsenceRequest;
use App\Services\AbsenceService;
use App\Services\TeacherContextService;

class TeacherAbsenceController extends Controller
{
    public function __construct(
        private readonly TeacherContextService $teacherContext,
        private readonly AbsenceService $absenceService,
    ) {
    }

    public function store(StoreAbsenceRequest $request)
    {
        $teacher = $this->teacherContext->getTeacherOrFail($request->user());

        $absence = $this->absenceService->create(
            teacher: $teacher,
            studentId: (int) $request->validated('student_id'),
            subjectId: (int) $request->validated('subject_id'),
            date: $request->validated('date'),
            justified: (bool) ($request->validated('justified') ?? false),
            lessonTopicId: $request->validated('lesson_topic_id') ? (int) $request->validated('lesson_topic_id') : null,
        );

        return response()->json([
            'message' => 'Absence created.',
            'absence' => $absence,
        ], 201);
    }
}

