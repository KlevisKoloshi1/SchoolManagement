<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SchoolClass;
use App\Models\Subject;

class AdminCatalogController extends Controller
{
    public function classes()
    {
        $classes = SchoolClass::query()->orderBy('name')->get(['id', 'name']);
        return response()->json(['classes' => $classes]);
    }

    public function subjects()
    {
        $subjects = Subject::query()->orderBy('name')->get(['id', 'name']);
        return response()->json(['subjects' => $subjects]);
    }
}
