<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Absence;
use Illuminate\Http\Request;

class StudentAbsenceController extends Controller
{
    public function index(Request $request)
    {
        $student = $request->user()->student;

        if (! $student) {
            return response()->json(['message' => 'Student profile not found.'], 422);
        }

        $absences = Absence::query()
            ->where('student_id', $student->id)
            ->with(['subject:id,name', 'teacher.user:id,name,username'])
            ->orderByDesc('date')
            ->get()
            ->map(function (Absence $a) {
                return [
                    'id' => $a->id,
                    'date' => $a->date->toDateString(),
                    'justified' => $a->justified,
                    'subject' => $a->subject ? ['id' => $a->subject->id, 'name' => $a->subject->name] : null,
                    'teacher' => $a->teacher && $a->teacher->user ? [
                        'id' => $a->teacher->id,
                        'name' => $a->teacher->user->name,
                        'username' => $a->teacher->user->username,
                    ] : null,
                ];
            });

        return response()->json(['data' => $absences]);
    }
}

