<?php

namespace App\Http\Requests;

use App\Enums\ProjectStatus;
use App\Enums\ProjectType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'type' => ['required', Rule::enum(ProjectType::class)],
            'status' => ['sometimes', Rule::enum(ProjectStatus::class)],
            'vision' => ['nullable', 'string'],
            'priority' => ['sometimes', 'integer', 'min:1', 'max:5'],
            'repo_url' => ['nullable', 'url', 'max:500'],
            'start_date' => ['nullable', 'date'],
            'target_date' => ['nullable', 'date', 'after_or_equal:start_date'],
        ];
    }
}
