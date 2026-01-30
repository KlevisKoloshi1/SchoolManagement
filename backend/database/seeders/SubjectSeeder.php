<?php

namespace Database\Seeders;

use App\Models\Subject;
use Illuminate\Database\Seeder;

class SubjectSeeder extends Seeder
{
    /**
     * Subjects: stored in English; Albanian names available in frontend i18n.
     * Matematikë, Histori, Gjeografi, Kimi, Informatikë Teknike, Programim,
     * Rrjeta, Gjuhë shqipe, Anglisht, Gjermanisht, Fiskulturë, Databazë,
     * Planifikim Sistemi, Biologji, Ekonomi, Fizikë, Këshillim Karriere
     */
    public function run(): void
    {
        $subjects = [
            'Mathematics',
            'History',
            'Geography',
            'Chemistry',
            'Technical Informatics',
            'Programming',
            'Networks',
            'Albanian Language',
            'English',
            'German',
            'Physical Education',
            'Databases',
            'System Planning',
            'Biology',
            'Economics',
            'Physics',
            'Career Counseling',
        ];

        foreach ($subjects as $name) {
            Subject::query()->updateOrCreate(['name' => $name]);
        }
    }
}
