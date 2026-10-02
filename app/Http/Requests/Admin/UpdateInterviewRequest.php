<?php

namespace App\Http\Requests\Admin;

use App\Support\InterviewFormats;
use App\Support\InterviewRecommendations;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateInterviewRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'scheduled_at' => ['required', 'date'],
            'interviewer_id' => ['nullable', 'integer', 'exists:users,id'],
            'format' => ['required', 'string', Rule::in(array_keys(InterviewFormats::OPTIONS))],
            'location_or_link' => ['nullable', 'string', 'max:255'],
            'status' => ['required', 'string', Rule::in(['scheduled', 'completed', 'cancelled', 'no_show'])],
            'recommendation' => [
                Rule::requiredIf($this->input('status') === 'completed'),
                'nullable', 'string', Rule::in(array_keys(InterviewRecommendations::OPTIONS)),
            ],
            'overall_notes' => ['nullable', 'string', 'max:5000'],
            'responses' => ['present', 'array'],
            'responses.*.id' => ['required', 'integer', 'exists:interview_question_responses,id'],
            'responses.*.score' => ['nullable', 'integer', 'min:1', 'max:5'],
            'responses.*.notes' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
