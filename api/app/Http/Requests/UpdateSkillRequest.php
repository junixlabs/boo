<?php

namespace App\Http\Requests;

use App\Enums\SkillLevel;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSkillRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'category_id' => ['sometimes', 'exists:skill_categories,id'],
            'name' => ['sometimes', 'string', 'max:255'],
            'current_level' => ['sometimes', Rule::enum(SkillLevel::class)],
            'target_level' => ['sometimes', Rule::enum(SkillLevel::class)],
            'notes' => ['nullable', 'string'],
        ];
    }
}
