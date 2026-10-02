<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAssessmentAttemptRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'status' => ['required', 'string', Rule::in(['completed', 'cancelled'])],
            'responses' => ['present', 'array'],
            'responses.*.id' => ['required', 'integer', 'exists:assessment_responses,id'],
            'responses.*.selected_option' => ['nullable', 'string', 'max:255'],
            'responses.*.answer_text' => ['nullable', 'string', 'max:2000'],
            'responses.*.points_awarded' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
