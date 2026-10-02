<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEducationRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'rows' => ['present', 'array'],
            'rows.*.institution_name' => ['required', 'string', 'max:255'],
            'rows.*.credential_earned' => ['nullable', 'string', 'max:255'],
            'rows.*.field_of_study' => ['nullable', 'string', 'max:255'],
            'rows.*.start_date' => ['nullable', 'date'],
            'rows.*.end_date' => ['nullable', 'date', 'after_or_equal:rows.*.start_date'],
            'rows.*.is_current' => ['boolean'],
            'rows.*.country' => ['nullable', 'string', 'max:255'],
            'rows.*.state' => ['nullable', 'string', 'max:255'],
        ];
    }
}
