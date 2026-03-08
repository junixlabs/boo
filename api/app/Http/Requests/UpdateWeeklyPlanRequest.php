<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateWeeklyPlanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'completed_summary' => ['sometimes', 'nullable', 'string'],
            'blocked_summary' => ['sometimes', 'nullable', 'string'],
            'next_summary' => ['sometimes', 'nullable', 'string'],
        ];
    }
}
