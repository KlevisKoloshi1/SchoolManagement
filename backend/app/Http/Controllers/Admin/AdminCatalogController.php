<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SchoolClass;
use App\Models\Subject;

class AdminCatalogController extends Controller
{
    public function classes(\Illuminate\Http\Request $request)
    {
        $query = SchoolClass::query()->orderBy('name');
        if ($request->boolean('available_for_main_teacher')) {
            $query->whereNull('main_teacher_id');
        }
        $classes = $query->get(['id', 'name']);
        return response()->json(['classes' => $classes]);
    }

    public function classStudents($classId)
    {
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

    public function subjects()
    {
        $subjects = Subject::query()->orderBy('name')->get(['id', 'name']);
        return response()->json(['subjects' => $subjects]);
    }
}
