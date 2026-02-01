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
     * Return all subjects so the main teacher can choose any subject
     * when adding lesson topics, absences, or grades (no admin assignment required).
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
