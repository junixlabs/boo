<?php

namespace App\Http\Requests;

use App\Enums\GoalStatus;
use App\Enums\GoalTimeframe;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateGoalRequest extends FormRequest
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
            'timeframe' => ['sometimes', Rule::enum(GoalTimeframe::class)],
            'status' => ['sometimes', Rule::enum(GoalStatus::class)],
            'target_date' => ['sometimes', 'nullable', 'date'],
            'progress' => ['sometimes', 'integer', 'min:0', 'max:100'],
            'sort_order' => ['sometimes', 'integer'],
        ];
    }
}
