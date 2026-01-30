<?php

namespace App\Http\Requests\Teacher;

use Illuminate\Foundation\Http\FormRequest;

class StoreGradeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'student_id' => ['required', 'integer', 'exists:students,id'],
            'subject_id' => ['required', 'integer', 'exists:subjects,id'],
            'lesson_topic_id' => ['nullable', 'integer', 'exists:lesson_topics,id'],
            'grade' => ['required', 'integer', 'min:0', 'max:100'],
            'date' => ['required', 'date'],
        ];
    }
}

