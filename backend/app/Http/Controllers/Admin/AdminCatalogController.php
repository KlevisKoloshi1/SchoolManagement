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

    public function subjects()
    {
        $subjects = Subject::query()->orderBy('name')->get(['id', 'name']);
        return response()->json(['subjects' => $subjects]);
    }
}
