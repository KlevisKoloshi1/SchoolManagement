<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Usage:
     * - role:admin
     * - role:main_teacher
     * - role:teacher (allows teacher + main_teacher)
     * - role:student (allows student + parent)
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        $user = $request->user();

        if (! $user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $allowedRoles = match ($role) {
            'teacher' => ['teacher', 'main_teacher'],
            'student' => ['student', 'parent'],
            default => [$role],
        };

        if (! in_array($user->role, $allowedRoles, true)) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        return $next($request);
    }
}

