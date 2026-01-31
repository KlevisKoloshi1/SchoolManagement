<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreTeacherRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'is_main_teacher' => ['required', 'boolean'],
            'class_id' => ['nullable', 'integer', 'exists:classes,id'],
            'subject_id' => ['nullable', 'integer', 'exists:subjects,id'],
            'subject_ids' => ['nullable', 'array'],
            'subject_ids.*' => ['integer', 'exists:subjects,id'],
        ];

        if ($this->boolean('is_main_teacher')) {
            $rules['class_id'] = ['required', 'integer', 'exists:classes,id'];
            $rules['subject_id'] = ['required', 'integer', 'exists:subjects,id'];
        } else {
            $rules['subject_ids'] = ['required', 'array', 'min:1'];
        }

        return $rules;
    }
}

