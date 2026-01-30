<?php

namespace App\Http\Requests\Teacher;

use Illuminate\Foundation\Http\FormRequest;

class StoreAbsenceRequest extends FormRequest
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
            'date' => ['required', 'date'],
            'justified' => ['sometimes', 'boolean'],
        ];
    }
}

