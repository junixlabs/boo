<?php

namespace App\Http\Requests;

use App\Enums\ReflectionType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreReflectionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'type' => ['required', Rule::enum(ReflectionType::class)],
            'period_start' => [
                'required',
                'date',
                Rule::unique('reflections')->where(fn ($q) => $q->where('user_id', $this->user()->id)->where('type', $this->input('type'))),
            ],
            'period_end' => ['required', 'date', 'after:period_start'],
            'went_well' => ['nullable', 'string'],
            'went_wrong' => ['nullable', 'string'],
            'to_improve' => ['nullable', 'string'],
            'projects_progress' => ['nullable', 'string'],
            'skills_improved' => ['nullable', 'string'],
            'mistakes' => ['nullable', 'string'],
            'opportunities' => ['nullable', 'string'],
        ];
    }
}
