<?php

namespace App\Http\Requests\Admin;

use App\Models\Announcement;
use Illuminate\Foundation\Http\FormRequest;

class StoreAnnouncementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = [
            'type' => ['required', 'string', 'in:'.Announcement::TYPE_CANCELLED.','.Announcement::TYPE_POSTPONED],
            'title' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:2000'],
            'subject_id' => ['nullable', 'integer', 'exists:subjects,id'],
            'for_all_classes' => ['required', 'boolean'],
            'class_ids' => ['nullable', 'array'],
            'class_ids.*' => ['integer', 'exists:classes,id'],
        ];
        if (! $this->boolean('for_all_classes')) {
            $rules['class_ids'] = ['required', 'array', 'min:1'];
        }
        return $rules;
    }
}
