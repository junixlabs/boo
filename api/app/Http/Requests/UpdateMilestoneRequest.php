<?php

namespace App\Http\Requests;

use App\Enums\MilestoneStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateMilestoneRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'status' => ['sometimes', Rule::enum(MilestoneStatus::class)],
            'target_date' => ['nullable', 'date'],
            'sort_order' => ['sometimes', 'integer'],
        ];
    }
}
