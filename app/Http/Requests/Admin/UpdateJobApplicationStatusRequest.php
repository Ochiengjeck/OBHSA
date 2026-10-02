<?php

namespace App\Http\Requests\Admin;

use App\Enums\ApplicationStatus;
use App\Support\ReviewReasonCodes;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
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
            'reason_code' => ['nullable', 'string', Rule::in(array_keys(ReviewReasonCodes::OPTIONS))],
        ];
    }
}
