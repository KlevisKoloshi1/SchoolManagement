<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Http\Requests\Report\PerformanceReportRequest;
use App\Models\Student;
use App\Services\StudentPerformanceReportService;
use App\Services\TeacherContextService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

class TeacherReportController extends Controller
{
    public function __construct(
        private readonly StudentPerformanceReportService $reportService,
        private readonly TeacherContextService $teacherContext
    ) {
    }

    /**
     * Get performance report for a student (teacher must have access to student's class).
     */
    public function index(PerformanceReportRequest $request): JsonResponse
    {
        $studentId = $request->validated('student_id');
        if (! $studentId) {
            return response()->json(['message' => 'student_id is required.'], 422);
        }

        $student = Student::query()->findOrFail($studentId);
        $this->authorize('viewReport', $student);

        $year = $request->validated('year') ? (int) $request->validated('year') : null;
        $semester = $request->validated('semester') ? (int) $request->validated('semester') : null;

        $report = $this->reportService->buildReport($student, $year, $semester);

        return response()->json($report);
    }

    /**
     * Export the performance report as PDF.
     */
    public function export(PerformanceReportRequest $request): Response|JsonResponse
    {
        $studentId = $request->validated('student_id');
        if (! $studentId) {
            return response()->json(['message' => 'student_id is required.'], 422);
        }

        $student = Student::query()->findOrFail($studentId);
        $this->authorize('viewReport', $student);

        $year = $request->validated('year') ? (int) $request->validated('year') : null;
        $semester = $request->validated('semester') ? (int) $request->validated('semester') : null;

        $report = $this->reportService->buildReport($student, $year, $semester);

        $pdf = Pdf::loadView('reports.performance-report', ['report' => $report]);
        $filename = 'performance-report-' . ($student->user?->name ?? $student->id) . '-' . now()->format('Y-m-d') . '.pdf';

        return $pdf->stream($filename);
    }
}
