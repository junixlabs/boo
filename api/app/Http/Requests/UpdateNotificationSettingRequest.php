<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateNotificationSettingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'push_enabled' => ['sometimes', 'boolean'],
            'morning_time' => ['sometimes', 'date_format:H:i'],
            'evening_time' => ['sometimes', 'date_format:H:i'],
        ];
    }
}
