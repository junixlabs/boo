<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDailyFocusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'task_id' => ['required', 'exists:tasks,id'],
            'focus_date' => ['sometimes', 'date'],
            'sort_order' => ['required', 'integer', 'min:1', 'max:3'],
            'note' => ['nullable', 'string'],
        ];
    }
}
