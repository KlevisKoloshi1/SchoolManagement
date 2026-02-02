<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Performance Report - {{ $report['student']['name'] ?? 'Student' }}</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 11px; color: #333; padding: 20px; }
        h1 { font-size: 18px; margin-bottom: 4px; }
        .meta { color: #666; font-size: 10px; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background: #f5f5f5; font-weight: 600; }
        .summary { display: flex; gap: 20px; margin-bottom: 24px; flex-wrap: wrap; }
        .summary-card { border: 1px solid #ddd; padding: 12px 20px; border-radius: 8px; min-width: 140px; }
        .summary-card strong { display: block; font-size: 20px; color: #1a1a1a; }
        .summary-card span { font-size: 10px; color: #666; }
        .section { margin-bottom: 24px; }
        .section h2 { font-size: 14px; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 4px; }
    </style>
</head>
<body>
    <h1>Performance Report</h1>
    <div class="meta">
        Student: <strong>{{ $report['student']['name'] ?? '—' }}</strong>
        @if(!empty($report['student']['class']))
            · Class: {{ $report['student']['class']['name'] }}
        @endif
        @if(!empty($report['filters']['year']))
            · Year: {{ $report['filters']['year'] }}
            @if(!empty($report['filters']['semester']))
                · Semester: {{ $report['filters']['semester'] }}
            @endif
        @else
            · All time
        @endif
        · Generated: {{ now()->format('Y-m-d H:i') }}
    </div>

    <div class="summary">
        <div class="summary-card">
            <strong>{{ $report['overall_average'] ?? '—' }}</strong>
            <span>Overall average</span>
        </div>
        <div class="summary-card">
            <strong>{{ $report['total_absences'] ?? 0 }}</strong>
            <span>Total absences</span>
        </div>
    </div>

    <div class="section">
        <h2>Average per subject</h2>
        <table>
            <thead>
                <tr>
                    <th>Subject</th>
                    <th>Average</th>
                </tr>
            </thead>
            <tbody>
                @forelse($report['grades_by_subject'] ?? [] as $row)
                    <tr>
                        <td>{{ $row['subject_name'] }}</td>
                        <td>{{ $row['average'] ?? '—' }}</td>
                    </tr>
                @empty
                    <tr><td colspan="2">No grades</td></tr>
                @endforelse
            </tbody>
        </table>
    </div>

    <div class="section">
        <h2>Absences per subject</h2>
        <table>
            <thead>
                <tr>
                    <th>Subject</th>
                    <th>Count</th>
                </tr>
            </thead>
            <tbody>
                @forelse($report['absences_by_subject'] ?? [] as $row)
                    <tr>
                        <td>{{ $row['subject_name'] }}</td>
                        <td>{{ $row['count'] }}</td>
                    </tr>
                @empty
                    <tr><td colspan="2">No absences</td></tr>
                @endforelse
            </tbody>
        </table>
    </div>
</body>
</html>
