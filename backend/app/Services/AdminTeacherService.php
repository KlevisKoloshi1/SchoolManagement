<?php

namespace App\Services;

use App\Enums\UserRole;
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

    /**
     * @return array{teacher: Teacher, username: string, password: string}
     */
    public function createTeacher(string $name, ?string $email, bool $isMainTeacher): array
    {
        return DB::transaction(function () use ($name, $email, $isMainTeacher) {
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

            return [
                'teacher' => $teacher->load('user'),
                'username' => $username,
                'password' => $passwordPlain,
            ];
        });
    }
}

