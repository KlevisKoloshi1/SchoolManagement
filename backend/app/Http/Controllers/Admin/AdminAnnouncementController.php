<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreAnnouncementRequest;
use App\Models\Announcement;
use Illuminate\Http\Request;

class AdminAnnouncementController extends Controller
{
    public function index()
    {
        $announcements = Announcement::query()
            ->with(['classes:id,name', 'subject:id,name'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'announcements' => $announcements->map(fn (Announcement $a) => [
                'id' => $a->id,
                'type' => $a->type,
                'title' => $a->title,
                'message' => $a->message,
                'subject_id' => $a->subject_id,
                'subject' => $a->subject ? ['id' => $a->subject->id, 'name' => $a->subject->name] : null,
                'for_all_classes' => $a->for_all_classes,
                'classes' => $a->classes->map(fn ($c) => ['id' => $c->id, 'name' => $c->name]),
                'created_at' => $a->created_at->toIso8601String(),
            ]),
        ]);
    }

    public function store(StoreAnnouncementRequest $request)
    {
        $validated = $request->validated();
        $announcement = Announcement::query()->create([
            'type' => $validated['type'],
            'title' => $validated['title'],
            'message' => $validated['message'],
            'subject_id' => $validated['subject_id'] ?? null,
            'for_all_classes' => $validated['for_all_classes'],
        ]);
        if (! empty($validated['class_ids']) && ! $announcement->for_all_classes) {
            $announcement->classes()->sync($validated['class_ids']);
        }
        $announcement->load(['classes:id,name', 'subject:id,name']);
        return response()->json([
            'message' => 'Announcement created.',
            'announcement' => $this->mapAnnouncement($announcement),
        ], 201);
    }

    public function update(StoreAnnouncementRequest $request, $id)
    {
        $announcement = Announcement::query()->findOrFail($id);
        $validated = $request->validated();
        $announcement->update([
            'type' => $validated['type'],
            'title' => $validated['title'],
            'message' => $validated['message'],
            'subject_id' => $validated['subject_id'] ?? null,
            'for_all_classes' => $validated['for_all_classes'],
        ]);
        if ($announcement->for_all_classes) {
            $announcement->classes()->sync([]);
        } else {
            $announcement->classes()->sync($validated['class_ids'] ?? []);
        }
        $announcement->load(['classes:id,name', 'subject:id,name']);
        return response()->json([
            'message' => 'Announcement updated.',
            'announcement' => $this->mapAnnouncement($announcement),
        ]);
    }

    public function destroy($id)
    {
        $announcement = Announcement::query()->findOrFail($id);
        $announcement->classes()->sync([]);
        $announcement->delete();
        return response()->json(['message' => 'Announcement deleted.']);
    }

    private function mapAnnouncement(Announcement $a): array
    {
        return [
            'id' => $a->id,
            'type' => $a->type,
            'title' => $a->title,
            'message' => $a->message,
            'subject_id' => $a->subject_id,
            'subject' => $a->subject ? ['id' => $a->subject->id, 'name' => $a->subject->name] : null,
            'for_all_classes' => $a->for_all_classes,
            'classes' => $a->classes->map(fn ($c) => ['id' => $c->id, 'name' => $c->name]),
            'created_at' => $a->created_at->toIso8601String(),
        ];
    }
}
