<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAssessmentQuestionRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $isMultipleChoice = $this->input('question_type') === 'multiple_choice';

        return [
            'question' => ['required', 'string', 'max:2000'],
            'question_type' => ['required', 'string', Rule::in(['multiple_choice', 'short_answer'])],
            'options' => [Rule::requiredIf($isMultipleChoice), 'nullable', 'array', 'min:2'],
            'options.*' => ['string', 'max:255'],
            'correct_option' => [
                Rule::requiredIf($isMultipleChoice), 'nullable', 'string',
                Rule::in((array) $this->input('options', [])),
            ],
            'points' => ['required', 'integer', 'min:1'],
            'position' => ['integer', 'min:0'],
        ];
    }
}
