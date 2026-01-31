<?php

namespace App\Http\Controllers\MainTeacher;

use App\Http\Controllers\Controller;
use App\Models\SchoolClass;
use App\Models\Subject;
use App\Services\TeacherContextService;
use Illuminate\Http\Request;

class MainTeacherCatalogController extends Controller
{
    public function __construct(private readonly TeacherContextService $teacherContext)
    {
    }

    /**
     * Return all subjects so main teachers can select any subject (including their assigned one)
     * when recording lessons, absences, and grades for their class or when viewing another class.
     */
    public function subjects(Request $request)
    {
        $this->teacherContext->getTeacherOrFail($request->user());
        $subjects = Subject::query()->orderBy('name')->get(['id', 'name']);
        return response()->json(['subjects' => $subjects]);
    }

    public function classes()
    {
        $classes = SchoolClass::query()->orderBy('name')->get(['id', 'name']);
        return response()->json(['classes' => $classes]);
    }
}
