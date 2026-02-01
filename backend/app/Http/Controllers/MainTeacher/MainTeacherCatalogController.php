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
     * When the main teacher is viewing their homeroom class: return all subjects.
     * When they switch to another class: return only the subjects assigned to them by the admin.
     */
    public function subjects(Request $request)
    {
        $teacher = $this->teacherContext->getTeacherOrFail($request->user());
        $teacher->load('homeroomClass');
        $queryClassId = $request->query('class_id');
        $homeroomId = $teacher->homeroomClass?->id;

        if ($queryClassId === null || $queryClassId === '' || (int) $queryClassId === $homeroomId) {
            $subjects = Subject::query()->orderBy('name')->get(['id', 'name']);
        } else {
            $teacher->load(['subjects' => fn ($q) => $q->orderBy('name')]);
            $subjects = $teacher->subjects->map(fn ($s) => ['id' => $s->id, 'name' => $s->name])->values();
        }

        return response()->json(['subjects' => $subjects]);
    }

    public function classes()
    {
        $classes = SchoolClass::query()->orderBy('name')->get(['id', 'name']);
        return response()->json(['classes' => $classes]);
    }
}
