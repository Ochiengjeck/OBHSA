<?php

namespace App\Http\Requests\Admin;

use App\Enums\ApplicationStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class UpdateJobApplicationStatusRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'status' => ['required', new Enum(ApplicationStatus::class)],
            'reason' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
