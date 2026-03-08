<?php

namespace App\Http\Requests;

use App\Enums\ReflectionType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ReviewPromptRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'type' => ['required', Rule::enum(ReflectionType::class)],
            'period_start' => ['required', 'date'],
        ];
    }
}
