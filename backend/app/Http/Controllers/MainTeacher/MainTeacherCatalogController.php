<?php

namespace App\Http\Controllers\MainTeacher;

use App\Http\Controllers\Controller;
use App\Models\SchoolClass;
use App\Services\TeacherContextService;
use Illuminate\Http\Request;

class MainTeacherCatalogController extends Controller
{
    public function __construct(private readonly TeacherContextService $teacherContext)
    {
    }

    public function subjects(Request $request)
    {
        $teacher = $this->teacherContext->getTeacherOrFail($request->user());
        $subjects = $teacher->subjects()->orderBy('name')->get(['id', 'name']);
        return response()->json(['subjects' => $subjects]);
    }

    public function classes()
    {
        $classes = SchoolClass::query()->orderBy('name')->get(['id', 'name']);
        return response()->json(['classes' => $classes]);
    }
}
