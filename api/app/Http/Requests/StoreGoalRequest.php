<?php

namespace App\Http\Requests;

use App\Enums\GoalStatus;
use App\Enums\GoalTimeframe;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreGoalRequest extends FormRequest
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
            'timeframe' => ['required', Rule::enum(GoalTimeframe::class)],
            'status' => ['sometimes', Rule::enum(GoalStatus::class)],
            'target_date' => ['nullable', 'date'],
            'sort_order' => ['sometimes', 'integer'],
        ];
    }
}
