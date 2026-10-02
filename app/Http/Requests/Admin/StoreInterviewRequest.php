<?php

namespace App\Http\Requests\Admin;

use App\Support\InterviewFormats;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreInterviewRequest extends FormRequest
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
        ];
    }
}
