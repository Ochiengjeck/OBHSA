<?php

namespace App\Http\Requests\Admin;

use App\Support\ReferenceCheckOutcomes;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreReferenceCheckRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'contact_method' => ['required', 'string', Rule::in(['phone', 'email'])],
            'contacted_at' => ['required', 'date'],
            'outcome' => ['required', 'string', Rule::in(array_keys(ReferenceCheckOutcomes::OPTIONS))],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
