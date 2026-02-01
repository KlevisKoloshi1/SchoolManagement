<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\SchoolClass;
use App\Services\TeacherContextService;
use Illuminate\Http\Request;

class TeacherCatalogController extends Controller
{
    public function __construct(private readonly TeacherContextService $teacherContext)
    {
    }

    public function subjects(Request $request)
    {
        $teacher = $this->teacherContext->getTeacherOrFail($request->user());
        $teacher->load(['subjects' => fn ($q) => $q->orderBy('name')]);
        $subjects = $teacher->subjects->map(fn ($s) => ['id' => $s->id, 'name' => $s->name]);
        return response()->json(['subjects' => $subjects->values()->all()]);
    }

    public function classes()
    {
        $classes = SchoolClass::query()->orderBy('name')->get(['id', 'name']);
        return response()->json(['classes' => $classes]);
    }

    public function classStudents(Request $request, $classId)
    {
        $this->teacherContext->getTeacherOrFail($request->user());
        $class = SchoolClass::query()->findOrFail($classId);
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
}
