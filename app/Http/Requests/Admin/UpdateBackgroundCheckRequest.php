<?php

namespace App\Http\Requests\Admin;

use App\Support\BackgroundCheckOutcomes;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateBackgroundCheckRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'status' => [
                'required', 'string',
                Rule::in([...array_keys(BackgroundCheckOutcomes::OPTIONS), 'cancelled']),
            ],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
