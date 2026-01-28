<?php

namespace App\Http\Controllers\MainTeacher;

use App\Http\Controllers\Controller;
use App\Http\Requests\Teacher\StoreAbsenceRequest;
use App\Services\AbsenceService;
use App\Services\TeacherContextService;

class MainTeacherAbsenceController extends Controller
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
        );

        return response()->json([
            'message' => 'Absence created.',
            'absence' => $absence,
        ], 201);
    }
}

