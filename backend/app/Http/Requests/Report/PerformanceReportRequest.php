<?php

namespace App\Http\Requests\Report;

use Illuminate\Foundation\Http\FormRequest;

class PerformanceReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'year' => ['nullable', 'integer', 'min:2000', 'max:2100'],
            'semester' => ['nullable', 'integer', 'in:1,2,3'],
            'student_id' => ['nullable', 'integer', 'exists:students,id'],
        ];
    }
}
