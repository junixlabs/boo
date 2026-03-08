<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class WeeklySummaryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'week_start' => ['required', 'date'],
        ];
    }
}
