<?php

namespace Database\Seeders;

use App\Models\SchoolClass;
use Illuminate\Database\Seeder;

class ClassSeeder extends Seeder
{
    public function run(): void
    {
        $classes = ['10A', '10B', '11A', '11B', '12A', '12B', '13A', '13B'];

        foreach ($classes as $name) {
            SchoolClass::query()->updateOrCreate(['name' => $name]);
        }
    }
}

