<?php

namespace App\Services;

use App\Enums\UserRole;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class MainTeacherStudentService
{
    public function __construct(private readonly CredentialService $credentialService)
    {
    }

    /**
     * @return array{student: Student, username: string, password: string}
     */
    public function addStudentForMainTeacher(User $mainTeacherUser, string $name, ?string $email = null): array
    {
        /** @var Teacher|null $teacher */
        $teacher = $mainTeacherUser->teacher;
        $class = $teacher?->homeroomClass;

        if (! $teacher || ! $teacher->is_main_teacher || ! $class) {
            throw ValidationException::withMessages([
                'class' => ['Main teacher is not assigned to a class.'],
            ]);
        }

        return DB::transaction(function () use ($name, $email, $class) {
            $username = $this->credentialService->generateUsername($name);
            $passwordPlain = $this->credentialService->generatePassword();

            if ($email !== null && User::query()->where('email', $email)->exists()) {
                throw ValidationException::withMessages(['email' => ['Email already exists.']]);
            }

            $user = User::query()->create([
                'name' => $name,
                'email' => $email ?? ($username.'@school.local'),
                'username' => $username,
                'password' => Hash::make($passwordPlain),
                'role' => UserRole::Student->value,
            ]);

            $student = Student::query()->create([
                'user_id' => $user->id,
                'class_id' => $class->id,
            ]);

            return [
                'student' => $student->load(['user', 'class']),
                'username' => $username,
                'password' => $passwordPlain,
            ];
        });
    }
}

