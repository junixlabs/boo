<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateReflectionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'went_well' => ['sometimes', 'nullable', 'string'],
            'went_wrong' => ['sometimes', 'nullable', 'string'],
            'to_improve' => ['sometimes', 'nullable', 'string'],
            'projects_progress' => ['sometimes', 'nullable', 'string'],
            'skills_improved' => ['sometimes', 'nullable', 'string'],
            'mistakes' => ['sometimes', 'nullable', 'string'],
            'opportunities' => ['sometimes', 'nullable', 'string'],
        ];
    }
}
