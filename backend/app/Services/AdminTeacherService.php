<?php

namespace App\Services;

use App\Enums\UserRole;
use App\Models\LessonTopic;
use App\Models\SchoolClass;
use App\Models\Subject;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AdminTeacherService
{
    public function __construct(private readonly CredentialService $credentialService)
    {
    }

    public function getAllTeachers()
    {
        return Teacher::query()
            ->with(['user', 'homeroomClass', 'subjects'])
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Get class details for a main teacher: class, students (with user), grades, absences.
     */
    public function getMainTeacherClassDetails(int $teacherId): array
    {
        $teacher = Teacher::query()
            ->with(['user', 'homeroomClass.students.user', 'homeroomClass.students.grades', 'homeroomClass.students.absences', 'subjects'])
            ->findOrFail($teacherId);

        if (! $teacher->is_main_teacher || ! $teacher->homeroomClass) {
            abort(404, 'Main teacher or class not found.');
        }

        $class = $teacher->homeroomClass;
        $students = $class->students->map(function ($student) {
            return [
                'id' => $student->id,
                'user' => [
                    'id' => $student->user->id,
                    'name' => $student->user->name,
                    'email' => $student->user->email,
                    'username' => $student->user->username,
                ],
                'grades' => $student->grades->map(fn ($g) => [
                    'id' => $g->id,
                    'subject_id' => $g->subject_id,
                    'grade' => $g->grade,
                    'date' => $g->date?->toDateString(),
                ]),
                'absences' => $student->absences->map(fn ($a) => [
                    'id' => $a->id,
                    'subject_id' => $a->subject_id,
                    'date' => $a->date?->toDateString(),
                    'justified' => $a->justified,
                ]),
            ];
        });

        $lessonTopics = LessonTopic::query()
            ->where('class_id', $class->id)
            ->with('subject:id,name')
            ->orderBy('date', 'desc')
            ->orderBy('id')
            ->get()
            ->map(fn ($t) => [
                'id' => $t->id,
                'title' => $t->title,
                'description' => $t->description,
                'date' => $t->date?->toDateString(),
                'subject' => $t->subject ? ['id' => $t->subject->id, 'name' => $t->subject->name] : null,
            ]);

        return [
            'teacher' => [
                'id' => $teacher->id,
                'user' => [
                    'id' => $teacher->user->id,
                    'name' => $teacher->user->name,
                    'email' => $teacher->user->email,
                    'username' => $teacher->user->username,
                ],
                'subjects' => $teacher->subjects->map(fn ($s) => ['id' => $s->id, 'name' => $s->name]),
            ],
            'class' => [
                'id' => $class->id,
                'name' => $class->name,
            ],
            'students' => $students,
            'lesson_topics' => $lessonTopics,
        ];
    }

    /**
     * @param  array<int>|null  $subjectIds
     * @return array{teacher: Teacher, username: string, password: string}
     */
    public function createTeacher(string $name, ?string $email, bool $isMainTeacher, ?int $classId = null, ?int $subjectId = null, ?array $subjectIds = null): array
    {
        return DB::transaction(function () use ($name, $email, $isMainTeacher, $classId, $subjectIds) {
            $subjectIdsToSync = $subjectIds;
            $username = $this->credentialService->generateUsername($name);
            $passwordPlain = $this->credentialService->generatePassword();

            $role = $isMainTeacher ? UserRole::MainTeacher->value : UserRole::Teacher->value;

            if ($email !== null && User::query()->where('email', $email)->exists()) {
                throw ValidationException::withMessages(['email' => ['Email already exists.']]);
            }

            $user = User::query()->create([
                'name' => $name,
                'email' => $email ?? ($username.'@school.local'),
                'username' => $username,
                'password' => Hash::make($passwordPlain),
                'role' => $role,
            ]);

            $teacher = Teacher::query()->create([
                'user_id' => $user->id,
                'is_main_teacher' => $isMainTeacher,
            ]);

            if ($isMainTeacher && $classId !== null) {
                $class = SchoolClass::query()->findOrFail($classId);
                if (SchoolClass::query()->where('main_teacher_id', $teacher->id)->exists()) {
                    // Should not happen on create
                }
                if ($class->main_teacher_id !== null) {
                    throw ValidationException::withMessages([
                        'class_id' => ['This class already has a main teacher assigned.'],
                    ]);
                }
                $class->main_teacher_id = $teacher->id;
                $class->save();
            }

            if ($isMainTeacher && ! empty($subjectIdsToSync)) {
                Subject::query()->whereIn('id', $subjectIdsToSync)->get();
                $teacher->subjects()->sync(array_values($subjectIdsToSync));
            }

            if (! $isMainTeacher && ! empty($subjectIds)) {
                $teacher->subjects()->sync(array_values($subjectIds));
            }

            return [
                'teacher' => $teacher->load(['user', 'homeroomClass', 'subjects']),
                'username' => $username,
                'password' => $passwordPlain,
            ];
        });
    }

    public function deleteTeacher(int $teacherId): void
    {
        DB::transaction(function () use ($teacherId) {
            $teacher = Teacher::query()->findOrFail($teacherId);
            $user = $teacher->user;
            
            // Delete the teacher record first
            $teacher->delete();
            
            // Then delete the associated user
            $user->delete();
        });
    }
}

