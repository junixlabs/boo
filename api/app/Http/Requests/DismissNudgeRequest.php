<?php

namespace App\Http\Requests;

use App\Services\NudgeService;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class DismissNudgeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nudge_type' => ['required', 'string', Rule::in(NudgeService::validTypes())],
        ];
    }
}
