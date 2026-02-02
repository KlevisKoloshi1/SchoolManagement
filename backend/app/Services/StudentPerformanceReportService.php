<?php

namespace App\Services;

use App\Models\Absence;
use App\Models\Grade;
use App\Models\Student;

class StudentPerformanceReportService
{
    /**
     * Build performance report for a student.
     *
     * @param  int|null  $year  Academic year start (e.g. 2024 = Sep 2024–Jun 2025). If null, all time.
     * @param  int|null  $semester  1 = Sep–Dec, 2 = Jan–Mar, 3 = Apr–Jun. If null, full year or all time.
     */
    public function buildReport(Student $student, ?int $year = null, ?int $semester = null): array
    {
        $student->load(['user:id,name', 'class:id,name']);

        $gradeQuery = Grade::query()
            ->where('student_id', $student->id)
            ->with('subject:id,name');

        $absenceQuery = Absence::query()
            ->where('student_id', $student->id)
            ->with('subject:id,name');

        $this->applyDateFilter($gradeQuery, $year, $semester, 'date');
        $this->applyDateFilter($absenceQuery, $year, $semester, 'date');

        $grades = $gradeQuery->orderBy('date')->get();
        $absences = $absenceQuery->get();

        $gradesBySubject = $this->groupGradesBySubject($grades);
        $absencesBySubject = $this->groupAbsencesBySubject($absences);

        $overallAverage = $this->computeOverallAverage($grades);
        $totalAbsences = $absences->count();

        $gradeProgress = $grades->map(fn ($g) => [
            'date' => $g->date->toDateString(),
            'grade' => $g->grade,
            'subject_id' => $g->subject_id,
            'subject_name' => $g->subject?->name,
        ])->values()->all();

        return [
            'student' => [
                'id' => $student->id,
                'name' => $student->user?->name,
                'class' => $student->class ? ['id' => $student->class->id, 'name' => $student->class->name] : null,
            ],
            'filters' => [
                'year' => $year,
                'semester' => $semester,
            ],
            'grades_by_subject' => $gradesBySubject,
            'overall_average' => $overallAverage,
            'absences_by_subject' => $absencesBySubject,
            'total_absences' => $totalAbsences,
            'grade_progress' => $gradeProgress,
        ];
    }

    private function applyDateFilter($query, ?int $year, ?int $semester, string $dateColumn): void
    {
        if ($year !== null) {
            if ($semester === 1) {
                // Semester 1: Sep–Dec (months 9–12 of academic year start)
                $query->whereYear($dateColumn, $year)
                    ->whereMonth($dateColumn, '>=', 9);
            } elseif ($semester === 2) {
                // Semester 2: Jan–Mar (months 1–3 of year after academic year start)
                $query->whereYear($dateColumn, $year + 1)
                    ->whereMonth($dateColumn, '<=', 3);
            } elseif ($semester === 3) {
                // Semester 3: Apr–Jun (months 4–6 of year after academic year start)
                $query->whereYear($dateColumn, $year + 1)
                    ->whereMonth($dateColumn, '>=', 4)
                    ->whereMonth($dateColumn, '<=', 6);
            } else {
                // Full academic year: Sep (year) through Jun (year+1)
                $query->where(function ($q) use ($dateColumn, $year) {
                    $q->where(function ($q2) use ($dateColumn, $year) {
                        $q2->whereYear($dateColumn, $year)->whereMonth($dateColumn, '>=', 9);
                    })->orWhere(function ($q2) use ($dateColumn, $year) {
                        $q2->whereYear($dateColumn, $year + 1)->whereMonth($dateColumn, '<=', 6);
                    });
                });
            }
        }
    }

    private function groupGradesBySubject($grades): array
    {
        $bySubject = $grades->groupBy('subject_id');

        return $bySubject->map(function ($subjectGrades, $subjectId) {
            $first = $subjectGrades->first();
            $subjectName = $first->subject?->name ?? '';
            $values = $subjectGrades->pluck('grade')->filter(fn ($v) => $v !== null)->values();
            $average = $values->isEmpty() ? null : round($values->avg(), 2);

            return [
                'subject_id' => (int) $subjectId,
                'subject_name' => $subjectName,
                'grades' => $subjectGrades->map(fn ($g) => [
                    'date' => $g->date->toDateString(),
                    'grade' => $g->grade,
                ])->values()->all(),
                'average' => $average,
            ];
        })->values()->all();
    }

    private function groupAbsencesBySubject($absences): array
    {
        return $absences->groupBy('subject_id')->map(function ($subjectAbsences, $subjectId) {
            $first = $subjectAbsences->first();

            return [
                'subject_id' => (int) $subjectId,
                'subject_name' => $first->subject?->name ?? '',
                'count' => $subjectAbsences->count(),
            ];
        })->values()->all();
    }

    private function computeOverallAverage($grades): ?float
    {
        $values = $grades->pluck('grade')->filter(fn ($v) => $v !== null);
        if ($values->isEmpty()) {
            return null;
        }

        return round($values->avg(), 2);
    }
}
