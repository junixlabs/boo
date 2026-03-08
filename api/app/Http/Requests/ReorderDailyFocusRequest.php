<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReorderDailyFocusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'focus_date' => ['required', 'date'],
            'order' => ['required', 'array', 'max:3'],
            'order.*' => ['required', 'integer', 'exists:daily_focuses,id'],
        ];
    }
}
