<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateApplicationDocumentsRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'resume' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:5120'],
            'add_credential' => ['boolean'],
            'credential_type' => ['required_if:add_credential,1', 'nullable', 'string', Rule::in(['license', 'certification'])],
            'credential_name' => ['required_if:add_credential,1', 'nullable', 'string', 'max:255'],
            'credential_number' => ['nullable', 'string', 'max:255'],
            'issuing_authority' => ['nullable', 'string', 'max:255'],
            'jurisdiction' => ['nullable', 'string', 'max:255'],
            'issue_date' => ['nullable', 'date'],
            'expiry_date' => ['nullable', 'date', 'after_or_equal:issue_date'],
            'credential_scan' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:5120'],
        ];
    }
}
