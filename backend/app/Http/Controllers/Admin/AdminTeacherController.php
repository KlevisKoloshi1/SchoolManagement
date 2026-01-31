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
                $payload = [
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
                if ($teacher->homeroomClass) {
                    $payload['class'] = [
                        'id' => $teacher->homeroomClass->id,
                        'name' => $teacher->homeroomClass->name,
                    ];
                }
                if ($teacher->subjects->isNotEmpty()) {
                    $payload['subjects'] = $teacher->subjects->map(fn ($s) => ['id' => $s->id, 'name' => $s->name]);
                }
                return $payload;
            }),
        ]);
    }

    public function mainTeacherClassDetails($id)
    {
        $data = $this->adminTeacherService->getMainTeacherClassDetails((int) $id);
        return response()->json($data);
    }

    public function store(StoreTeacherRequest $request)
    {
        $validated = $request->validated();
        $subjectIds = isset($validated['subject_ids']) ? array_map('intval', $validated['subject_ids']) : null;
        $result = $this->adminTeacherService->createTeacher(
            name: $validated['name'],
            email: $validated['email'] ?? null,
            isMainTeacher: (bool) $validated['is_main_teacher'],
            classId: isset($validated['class_id']) ? (int) $validated['class_id'] : null,
            subjectId: isset($validated['subject_id']) ? (int) $validated['subject_id'] : null,
            subjectIds: $subjectIds,
        );

        $teacher = $result['teacher'];
        $payload = [
            'id' => $teacher->id,
            'user' => [
                'id' => $teacher->user->id,
                'name' => $teacher->user->name,
                'email' => $teacher->user->email,
                'username' => $teacher->user->username,
                'role' => $teacher->user->role,
            ],
            'is_main_teacher' => $teacher->is_main_teacher,
        ];
        if ($teacher->relationLoaded('homeroomClass') && $teacher->homeroomClass) {
            $payload['class'] = [
                'id' => $teacher->homeroomClass->id,
                'name' => $teacher->homeroomClass->name,
            ];
        }
        if ($teacher->relationLoaded('subjects') && $teacher->subjects->isNotEmpty()) {
            $payload['subjects'] = $teacher->subjects->map(fn ($s) => ['id' => $s->id, 'name' => $s->name]);
        }

        return response()->json([
            'message' => 'Teacher created.',
            'teacher' => $payload,
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

