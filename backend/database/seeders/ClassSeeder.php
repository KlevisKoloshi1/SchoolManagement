<?php

namespace Database\Seeders;

use App\Models\SchoolClass;
use Illuminate\Database\Seeder;

class ClassSeeder extends Seeder
{
    public function run(): void
    {
        $classes = ['10a', '10b', '11a', '11b', '12a', '12b', '13a', '13b'];

        foreach ($classes as $name) {
            SchoolClass::query()->updateOrCreate(['name' => $name]);
        }
    }
}

