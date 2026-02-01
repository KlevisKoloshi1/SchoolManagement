<?php

namespace App\Http\Controllers\MainTeacher;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\Announcement;
use App\Services\TeacherContextService;
use Illuminate\Http\Request;

/**
 * Same code path as MainTeacherStudentController (dashboard): use TeacherContextService
 * to get the teacher, then teacher->homeroomClass for the class. Same Activity query as Student.
 */
class MainTeacherNotificationController extends Controller
{
    public function __construct(private readonly TeacherContextService $teacherContext)
    {
    }

    /**
     * Get homeroom class id exactly like MainTeacherStudentController (dashboard).
     * If no homeroom, we still return for_all_classes activities so main teacher sees something.
     */
    private function getHomeroomClassId(Request $request): ?int
    {
        try {
            $teacher = $this->teacherContext->getTeacherOrFail($request->user());
            $homeroom = $teacher->homeroomClass;
            return $homeroom?->id;
        } catch (\Throwable) {
            return null;
        }
    }

    /**
     * Build the same Activity query as StudentNotificationController::activities().
     */
    private function activitiesQuery(?int $classId)
    {
        $query = Activity::query()
            ->orderBy('date', 'desc')
            ->orderBy('id', 'desc');
        if ($classId) {
            $query->where(function ($q) use ($classId) {
                $q->where('for_all_classes', true)
                    ->orWhereHas('classes', fn ($q) => $q->where('classes.id', $classId));
            });
        } else {
            $query->where('for_all_classes', true);
        }
        return $query->get();
    }

    public function activities(Request $request)
    {
        $classId = $this->getHomeroomClassId($request);
        $activities = $this->activitiesQuery($classId);
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
        $classId = $this->getHomeroomClassId($request);
        if (! $classId) {
            $announcements = Announcement::query()
                ->with('subject:id,name')
                ->where('for_all_classes', true)
                ->orderBy('created_at', 'desc')
                ->get();
        } else {
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
        }
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
        $classId = $this->getHomeroomClassId($request);
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
            'activities' => $activities->map(fn (Activity $a) => [
                'id' => $a->id,
                'name' => $a->name,
                'date' => $a->date->format('Y-m-d'),
                'description' => $a->description,
            ]),
        ]);
    }

    /**
     * Laravel database notifications (e.g. "new announcement for your class").
     * Returns unread notifications for the current user.
     */
    public function databaseNotifications(Request $request)
    {
        $user = $request->user();
        $notifications = $user->unreadNotifications()
            ->orderBy('created_at', 'desc')
            ->limit(50)
            ->get();

        return response()->json([
            'notifications' => $notifications->map(function ($n) {
                $data = $n->data;
                return [
                    'id' => $n->id,
                    'type' => $data['type'] ?? null,
                    'announcement_id' => $data['announcement_id'] ?? null,
                    'title' => $data['title'] ?? null,
                    'message' => $data['message'] ?? null,
                    'announcement_type' => $data['announcement_type'] ?? null,
                    'class_name' => $data['class_name'] ?? null,
                    'created_at' => $n->created_at->toIso8601String(),
                ];
            }),
            'unread_count' => $user->unreadNotifications()->count(),
        ]);
    }

    /**
     * Mark one or all notifications as read.
     */
    public function markNotificationsRead(Request $request)
    {
        $user = $request->user();
        $id = $request->query('id');
        if ($id) {
            $user->unreadNotifications()->where('id', $id)->update(['read_at' => now()]);
        } else {
            $user->unreadNotifications()->update(['read_at' => now()]);
        }
        return response()->json(['message' => 'Marked as read.']);
    }
}
