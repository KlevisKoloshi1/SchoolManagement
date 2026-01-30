<?php

namespace App\Http\Requests\MainTeacher;

use Illuminate\Foundation\Http\FormRequest;

class StoreLessonTopicRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'subject_id' => ['required', 'integer', 'exists:subjects,id'],
            'class_id' => ['nullable', 'integer', 'exists:classes,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'date' => ['required', 'date'],
        ];
    }
}
