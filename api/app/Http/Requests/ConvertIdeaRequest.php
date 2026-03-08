<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ConvertIdeaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'convert_to' => ['required', 'in:project,task'],
            'project_id' => ['required_if:convert_to,task', 'nullable', 'exists:projects,id'],
        ];
    }
}
