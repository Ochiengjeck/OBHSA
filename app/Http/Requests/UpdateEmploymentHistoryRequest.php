<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEmploymentHistoryRequest extends FormRequest
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
            'rows.*.employer_name' => ['required', 'string', 'max:255'],
            'rows.*.job_title' => ['required', 'string', 'max:255'],
            'rows.*.employment_type' => ['nullable', 'string', 'max:255'],
            'rows.*.city' => ['nullable', 'string', 'max:255'],
            'rows.*.state' => ['nullable', 'string', 'max:255'],
            'rows.*.country' => ['nullable', 'string', 'max:255'],
            'rows.*.start_date' => ['required', 'date'],
            'rows.*.end_date' => ['nullable', 'date', 'after_or_equal:rows.*.start_date'],
            'rows.*.is_current' => ['boolean'],
            'rows.*.responsibilities' => ['nullable', 'string', 'max:2000'],
            'rows.*.supervisor_name' => ['nullable', 'string', 'max:255'],
            'rows.*.supervisor_contact' => ['nullable', 'string', 'max:255'],
            'rows.*.reason_for_leaving' => ['nullable', 'string', 'max:500'],
        ];
    }
}
