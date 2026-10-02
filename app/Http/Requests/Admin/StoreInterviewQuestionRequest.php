<?php

namespace App\Http\Requests\Admin;

use App\Support\CaregiverSpecialties;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreInterviewQuestionRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'question' => ['required', 'string', 'max:2000'],
            'specialty' => ['nullable', 'string', Rule::in(array_keys(CaregiverSpecialties::OPTIONS))],
            'is_active' => ['boolean'],
            'position' => ['integer', 'min:0'],
        ];
    }
}
