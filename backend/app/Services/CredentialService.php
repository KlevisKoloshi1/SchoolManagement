<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Str;

class CredentialService
{
    public function generateUsername(string $nameOrBase): string
    {
        $base = Str::slug($nameOrBase, '');
        $base = $base !== '' ? $base : 'user';

        $username = $base;
        $i = 0;
        while (User::query()->where('username', $username)->exists()) {
            $i++;
            $username = $base.$i;
        }

        return $username;
    }

    public function generatePassword(int $length = 12): string
    {
        // Ensures at least one of each class: upper, lower, digit, symbol.
        $upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
        $lower = 'abcdefghijkmnopqrstuvwxyz';
        $digits = '23456789';
        $symbols = '@$!%*?&._-';

        $all = $upper.$lower.$digits.$symbols;

        $password = '';
        $password .= $upper[random_int(0, strlen($upper) - 1)];
        $password .= $lower[random_int(0, strlen($lower) - 1)];
        $password .= $digits[random_int(0, strlen($digits) - 1)];
        $password .= $symbols[random_int(0, strlen($symbols) - 1)];

        while (strlen($password) < $length) {
            $password .= $all[random_int(0, strlen($all) - 1)];
        }

        return str_shuffle($password);
    }
}

