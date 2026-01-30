<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreTeacherRequest;
use App\Services\AdminTeacherService;

class AdminTeacherController extends Controller
{
    public function __construct(private readonly AdminTeacherService $adminTeacherService)
    {
    }

    public function index()
    {
        $teachers = $this->adminTeacherService->getAllTeachers();

        return response()->json([
            'teachers' => $teachers->map(function ($teacher) {
                return [
                    'id' => $teacher->id,
                    'user' => [
                        'id' => $teacher->user->id,
                        'name' => $teacher->user->name,
                        'email' => $teacher->user->email,
                        'username' => $teacher->user->username,
                        'role' => $teacher->user->role,
                    ],
                    'is_main_teacher' => $teacher->is_main_teacher,
                    'created_at' => $teacher->created_at,
                ];
            }),
        ]);
    }

    public function store(StoreTeacherRequest $request)
    {
        $result = $this->adminTeacherService->createTeacher(
            name: $request->validated('name'),
            email: $request->validated('email'),
            isMainTeacher: (bool) $request->validated('is_main_teacher'),
        );

        return response()->json([
            'message' => 'Teacher created.',
            'teacher' => [
                'id' => $result['teacher']->id,
                'user' => [
                    'id' => $result['teacher']->user->id,
                    'name' => $result['teacher']->user->name,
                    'email' => $result['teacher']->user->email,
                    'username' => $result['teacher']->user->username,
                    'role' => $result['teacher']->user->role,
                ],
                'is_main_teacher' => $result['teacher']->is_main_teacher,
            ],
            // Return once so desktop app can show/print credentials
            'credentials' => [
                'username' => $result['username'],
                'password' => $result['password'],
            ],
        ], 201);
    }

    public function destroy($id)
    {
        $this->adminTeacherService->deleteTeacher($id);

        return response()->json([
            'message' => 'Teacher deleted successfully.',
        ]);
    }
}

