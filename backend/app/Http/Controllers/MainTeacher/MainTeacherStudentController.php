<?php

namespace App\Http\Controllers\MainTeacher;

use App\Http\Controllers\Controller;
use App\Http\Requests\MainTeacher\StoreStudentRequest;
use App\Services\MainTeacherStudentService;
use App\Services\TeacherContextService;
use Illuminate\Http\Request;

class MainTeacherStudentController extends Controller
{
    public function __construct(
        private readonly MainTeacherStudentService $service,
        private readonly TeacherContextService $teacherContext,
    ) {
    }

    public function index(Request $request)
    {
        $teacher = $this->teacherContext->getTeacherOrFail($request->user());
        $class = $teacher->homeroomClass;
        if (! $class) {
            return response()->json(['students' => [], 'class' => null]);
        }
        $students = $class->students()->with('user')->orderBy('id')->get();
        return response()->json([
            'class' => ['id' => $class->id, 'name' => $class->name],
            'students' => $students->map(fn ($s) => [
                'id' => $s->id,
                'user' => [
                    'id' => $s->user->id,
                    'name' => $s->user->name,
                    'email' => $s->user->email,
                    'username' => $s->user->username,
                ],
            ]),
        ]);
    }

    public function store(StoreStudentRequest $request)
    {
        $result = $this->service->addStudentForMainTeacher(
            mainTeacherUser: $request->user(),
            name: $request->validated('name'),
            email: $request->validated('email'),
        );

        return response()->json([
            'message' => 'Student created.',
            'student' => [
                'id' => $result['student']->id,
                'class' => [
                    'id' => $result['student']->class->id,
                    'name' => $result['student']->class->name,
                ],
                'user' => [
                    'id' => $result['student']->user->id,
                    'name' => $result['student']->user->name,
                    'email' => $result['student']->user->email,
                    'username' => $result['student']->user->username,
                    'role' => $result['student']->user->role,
                ],
            ],
            // Parent uses student credentials (same login)
            'credentials' => [
                'username' => $result['username'],
                'password' => $result['password'],
            ],
        ], 201);
    }
}

