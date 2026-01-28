<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AssignClassRequest;
use App\Http\Requests\Admin\AssignSubjectRequest;
use App\Services\AssignmentService;

class AssignmentController extends Controller
{
    public function __construct(private readonly AssignmentService $assignmentService)
    {
    }

    public function assignClass(AssignClassRequest $request)
    {
        $class = $this->assignmentService->assignMainTeacherToClass(
            teacherId: (int) $request->validated('teacher_id'),
            classId: (int) $request->validated('class_id'),
        );

        return response()->json([
            'message' => 'Class assigned.',
            'class' => [
                'id' => $class->id,
                'name' => $class->name,
                'main_teacher' => $class->mainTeacher ? [
                    'id' => $class->mainTeacher->id,
                    'user' => [
                        'id' => $class->mainTeacher->user->id,
                        'name' => $class->mainTeacher->user->name,
                        'username' => $class->mainTeacher->user->username,
                        'email' => $class->mainTeacher->user->email,
                    ],
                ] : null,
            ],
        ]);
    }

    public function assignSubject(AssignSubjectRequest $request)
    {
        $this->assignmentService->assignSubjectToTeacher(
            teacherId: (int) $request->validated('teacher_id'),
            subjectId: (int) $request->validated('subject_id'),
        );

        return response()->json(['message' => 'Subject assigned.']);
    }
}

