<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreWeeklyPlanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'week_start' => [
                'required',
                'date',
                Rule::unique('weekly_plans')->where(fn ($q) => $q->where('user_id', $this->user()->id)),
            ],
            'completed_summary' => ['nullable', 'string'],
            'blocked_summary' => ['nullable', 'string'],
            'next_summary' => ['nullable', 'string'],
        ];
    }
}
