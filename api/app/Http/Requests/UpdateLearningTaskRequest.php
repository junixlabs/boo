<?php

namespace App\Http\Requests;

use App\Enums\LearningTaskStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateLearningTaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string'],
            'status' => ['sometimes', Rule::enum(LearningTaskStatus::class)],
            'resource_url' => ['sometimes', 'nullable', 'url', 'max:500'],
        ];
    }
}
