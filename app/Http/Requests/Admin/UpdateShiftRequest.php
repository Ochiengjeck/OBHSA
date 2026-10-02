<?php

namespace App\Http\Requests\Admin;

use App\Support\CaregiverSpecialties;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateShiftRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'specialty' => ['required', Rule::in(array_keys(CaregiverSpecialties::OPTIONS))],
            'shift_date' => ['required', 'date'],
            'start_time' => ['required', 'date_format:H:i'],
            'end_time' => ['required', 'date_format:H:i', 'after:start_time'],
            'slots_needed' => ['required', 'integer', 'min:1'],
            'pay_rate' => ['nullable', 'numeric', 'min:0'],
            'notes' => ['nullable', 'string', 'max:2000'],
            'status' => ['nullable', Rule::in(['open', 'cancelled'])],
        ];
    }
}
