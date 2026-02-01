<?php

namespace App\Http\Controllers\MainTeacher;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\Announcement;
use App\Services\TeacherContextService;
use Illuminate\Http\Request;

class MainTeacherNotificationController extends Controller
{
    public function __construct(private readonly TeacherContextService $teacherContext)
    {
    }

    private function classId(Request $request): ?int
    {
        $teacher = $this->teacherContext->getTeacherOrFail($request->user());
        $teacher->load('homeroomClass');
        $queryClassId = $request->query('class_id');
        if ($queryClassId !== null && $queryClassId !== '') {
            return (int) $queryClassId;
        }
        return $teacher->homeroomClass?->id;
    }

    public function activities(Request $request)
    {
        $classId = $this->classId($request);
        $query = Activity::query();
        if ($classId) {
            $query->where(function ($q) use ($classId) {
                $q->where('for_all_classes', true)
                    ->orWhereHas('classes', function ($q2) use ($classId) {
                        $q2->where('classes.id', $classId);
                    });
            });
        } else {
            $query->where('for_all_classes', true);
        }
        $activities = $query->orderBy('date', 'desc')->orderBy('id', 'desc')->get();
        return response()->json([
            'activities' => $activities->map(function (Activity $a) {
                return [
                    'id' => $a->id,
                    'name' => $a->name,
                    'date' => $a->date->format('Y-m-d'),
                    'description' => $a->description,
                ];
            }),
        ]);
    }

    public function announcements(Request $request)
    {
        $classId = $this->classId($request);
        $query = Announcement::query()->with('subject:id,name');
        if ($classId) {
            $query->where(function ($q) use ($classId) {
                $q->where('for_all_classes', true)
                    ->orWhereHas('classes', function ($q2) use ($classId) {
                        $q2->where('classes.id', $classId);
                    });
            });
        } else {
            $query->where('for_all_classes', true);
        }
        $announcements = $query->orderBy('created_at', 'desc')->get();
        return response()->json([
            'announcements' => $announcements->map(function (Announcement $a) {
                return [
                    'id' => $a->id,
                    'type' => $a->type,
                    'title' => $a->title,
                    'message' => $a->message,
                    'subject' => $a->subject ? ['id' => $a->subject->id, 'name' => $a->subject->name] : null,
                    'created_at' => $a->created_at->toIso8601String(),
                ];
            }),
        ]);
    }

    public function calendar(Request $request)
    {
        $classId = $this->classId($request);
        $from = $request->query('from') ?: now()->startOfMonth()->format('Y-m-d');
        $to = $request->query('to') ?: now()->endOfMonth()->format('Y-m-d');
        $query = Activity::query()->whereBetween('date', [$from, $to]);
        if ($classId) {
            $query->where(function ($q) use ($classId) {
                $q->where('for_all_classes', true)
                    ->orWhereHas('classes', function ($q2) use ($classId) {
                        $q2->where('classes.id', $classId);
                    });
            });
        } else {
            $query->where('for_all_classes', true);
        }
        $activities = $query->orderBy('date')->get();
        return response()->json([
            'activities' => $activities->map(function (Activity $a) {
                return [
                    'id' => $a->id,
                    'name' => $a->name,
                    'date' => $a->date->format('Y-m-d'),
                    'description' => $a->description,
                ];
            }),
        ]);
    }
}
