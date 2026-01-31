<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreActivityRequest;
use App\Models\Activity;

class AdminActivityController extends Controller
{
    public function index()
    {
        $activities = Activity::query()
            ->with(['classes:id,name'])
            ->orderBy('date', 'desc')
            ->orderBy('id', 'desc')
            ->get();

        return response()->json([
            'activities' => $activities->map(function (Activity $a) {
                return [
                    'id' => $a->id,
                    'name' => $a->name,
                    'date' => $a->date->format('Y-m-d'),
                    'description' => $a->description,
                    'for_all_classes' => $a->for_all_classes,
                    'classes' => $a->classes->map(fn ($c) => ['id' => $c->id, 'name' => $c->name]),
                ];
            }),
        ]);
    }

    public function store(StoreActivityRequest $request)
    {
        $validated = $request->validated();
        $activity = Activity::query()->create([
            'name' => $validated['name'],
            'date' => $validated['date'],
            'description' => $validated['description'] ?? null,
            'for_all_classes' => $validated['for_all_classes'],
        ]);
        if (! empty($validated['class_ids']) && ! $activity->for_all_classes) {
            $activity->classes()->sync($validated['class_ids']);
        }
        $activity->load('classes:id,name');
        return response()->json([
            'message' => 'Activity created.',
            'activity' => [
                'id' => $activity->id,
                'name' => $activity->name,
                'date' => $activity->date->format('Y-m-d'),
                'description' => $activity->description,
                'for_all_classes' => $activity->for_all_classes,
                'classes' => $activity->classes->map(fn ($c) => ['id' => $c->id, 'name' => $c->name]),
            ],
        ], 201);
    }

    public function update(StoreActivityRequest $request, $id)
    {
        $activity = Activity::query()->findOrFail($id);
        $validated = $request->validated();
        $activity->update([
            'name' => $validated['name'],
            'date' => $validated['date'],
            'description' => $validated['description'] ?? null,
            'for_all_classes' => $validated['for_all_classes'],
        ]);
        if ($activity->for_all_classes) {
            $activity->classes()->sync([]);
        } else {
            $activity->classes()->sync($validated['class_ids'] ?? []);
        }
        $activity->load('classes:id,name');
        return response()->json([
            'message' => 'Activity updated.',
            'activity' => [
                'id' => $activity->id,
                'name' => $activity->name,
                'date' => $activity->date->format('Y-m-d'),
                'description' => $activity->description,
                'for_all_classes' => $activity->for_all_classes,
                'classes' => $activity->classes->map(fn ($c) => ['id' => $c->id, 'name' => $c->name]),
            ],
        ]);
    }

    public function destroy($id)
    {
        $activity = Activity::query()->findOrFail($id);
        $activity->classes()->sync([]);
        $activity->delete();
        return response()->json(['message' => 'Activity deleted.']);
    }
}
