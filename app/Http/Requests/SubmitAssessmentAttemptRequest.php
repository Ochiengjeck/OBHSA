<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SubmitAssessmentAttemptRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'responses' => ['present', 'array'],
            'responses.*.id' => ['required', 'integer', 'exists:assessment_responses,id'],
            'responses.*.selected_option' => ['nullable', 'string', 'max:255'],
            'responses.*.answer_text' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
