<?php

namespace App\Http\Controllers\MainTeacher;

use App\Http\Controllers\Controller;
use App\Http\Requests\Teacher\StoreGradeRequest;
use App\Services\GradeService;
use App\Services\TeacherContextService;

class MainTeacherGradeController extends Controller
{
    public function __construct(
        private readonly TeacherContextService $teacherContext,
        private readonly GradeService $gradeService,
    ) {
    }

    public function store(StoreGradeRequest $request)
    {
        $teacher = $this->teacherContext->getTeacherOrFail($request->user());

        $grade = $this->gradeService->create(
            teacher: $teacher,
            studentId: (int) $request->validated('student_id'),
            subjectId: (int) $request->validated('subject_id'),
            gradeValue: (int) $request->validated('grade'),
            date: $request->validated('date'),
        );

        return response()->json([
            'message' => 'Grade created.',
            'grade' => $grade,
        ], 201);
    }
}

