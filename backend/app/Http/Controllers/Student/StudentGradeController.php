<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Grade;
use Illuminate\Http\Request;

class StudentGradeController extends Controller
{
    public function index(Request $request)
    {
        $student = $request->user()->student;

        if (! $student) {
            return response()->json(['message' => 'Student profile not found.'], 422);
        }

        $grades = Grade::query()
            ->where('student_id', $student->id)
            ->with(['subject:id,name', 'lessonTopic:id,title,date', 'teacher.user:id,name,username'])
            ->orderByDesc('date')
            ->get()
            ->map(function (Grade $g) {
                return [
                    'id' => $g->id,
                    'grade' => $g->grade,
                    'date' => $g->date->toDateString(),
                    'subject' => $g->subject ? ['id' => $g->subject->id, 'name' => $g->subject->name] : null,
                    'topic' => $g->lessonTopic ? ['id' => $g->lessonTopic->id, 'title' => $g->lessonTopic->title] : null,
                    'teacher' => $g->teacher && $g->teacher->user ? [
                        'id' => $g->teacher->id,
                        'name' => $g->teacher->user->name,
                        'username' => $g->teacher->user->username,
                    ] : null,
                ];
            });

        return response()->json(['data' => $grades]);
    }
}

