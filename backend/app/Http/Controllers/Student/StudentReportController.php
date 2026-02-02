<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Http\Requests\Report\PerformanceReportRequest;
use App\Services\StudentPerformanceReportService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

class StudentReportController extends Controller
{
    public function __construct(
        private readonly StudentPerformanceReportService $reportService
    ) {
    }

    /**
     * Get the authenticated student's performance report.
     */
    public function index(PerformanceReportRequest $request): JsonResponse
    {
        $student = $request->user()->student;
        if (! $student) {
            return response()->json(['message' => 'Student profile not found.'], 422);
        }

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
        $student = $request->user()->student;
        if (! $student) {
            return response()->json(['message' => 'Student profile not found.'], 422);
        }

        $this->authorize('viewReport', $student);

        $year = $request->validated('year') ? (int) $request->validated('year') : null;
        $semester = $request->validated('semester') ? (int) $request->validated('semester') : null;

        $report = $this->reportService->buildReport($student, $year, $semester);

        $pdf = Pdf::loadView('reports.performance-report', ['report' => $report]);
        $filename = 'performance-report-' . ($student->user?->name ?? $student->id) . '-' . now()->format('Y-m-d') . '.pdf';

        return $pdf->stream($filename);
    }
}
