<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\Announcement;
use Illuminate\Http\Request;

class StudentNotificationController extends Controller
{
    public function activities(Request $request)
    {
        $student = $request->user()->student;
        if (! $student || ! $student->class_id) {
            return response()->json(['activities' => []]);
        }
        $classId = $student->class_id;
        $activities = Activity::query()
            ->where(function ($q) use ($classId) {
                $q->where('for_all_classes', true)
                    ->orWhereHas('classes', fn ($q) => $q->where('classes.id', $classId));
            })
            ->orderBy('date', 'desc')
            ->orderBy('id', 'desc')
            ->get();
        return response()->json([
            'activities' => $activities->map(fn (Activity $a) => [
                'id' => $a->id,
                'name' => $a->name,
                'date' => $a->date->format('Y-m-d'),
                'description' => $a->description,
            ]),
        ]);
    }

    public function announcements(Request $request)
    {
        $student = $request->user()->student;
        if (! $student || ! $student->class_id) {
            return response()->json(['announcements' => []]);
        }
        $classId = $student->class_id;
        $announcements = Announcement::query()
            ->with('subject:id,name')
            ->where(function ($q) use ($classId) {
                $q->where('for_all_classes', true)
                    ->orWhereHas('classes', function ($q2) use ($classId) {
                        $q2->where('classes.id', $classId);
                    });
            })
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json([
            'announcements' => $announcements->map(fn (Announcement $a) => [
                'id' => $a->id,
                'type' => $a->type,
                'title' => $a->title,
                'message' => $a->message,
                'subject' => $a->subject ? ['id' => $a->subject->id, 'name' => $a->subject->name] : null,
                'created_at' => $a->created_at->toIso8601String(),
            ]),
        ]);
    }

    public function calendar(Request $request)
    {
        $student = $request->user()->student;
        if (! $student || ! $student->class_id) {
            return response()->json(['activities' => []]);
        }
        $classId = $student->class_id;
        $from = $request->query('from') ?: now()->startOfMonth()->format('Y-m-d');
        $to = $request->query('to') ?: now()->endOfMonth()->format('Y-m-d');
        $activities = Activity::query()
            ->where(function ($q) use ($classId) {
                $q->where('for_all_classes', true)
                    ->orWhereHas('classes', function ($q2) use ($classId) {
                        $q2->where('classes.id', $classId);
                    });
            })
            ->whereBetween('date', [$from, $to])
            ->orderBy('date')
            ->get();
        return response()->json([
            'activities' => $activities->map(fn (Activity $a) => [
                'id' => $a->id,
                'name' => $a->name,
                'date' => $a->date->format('Y-m-d'),
                'description' => $a->description,
            ]),
        ]);
    }
}
