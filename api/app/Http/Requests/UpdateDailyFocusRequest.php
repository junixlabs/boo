<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDailyFocusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'sort_order' => ['sometimes', 'integer', 'min:1', 'max:3'],
            'note' => ['nullable', 'string'],
        ];
    }
}
