<?php

namespace App\Http\Requests\Admin;

use App\Models\Shift;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreShiftAssignmentRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request. The employee
     * must be active and match this shift's specialty — the same filter
     * the assignment dropdown itself applies, enforced again here so a
     * mismatched id can never be posted directly.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        /** @var Shift $shift */
        $shift = $this->route('shift');

        return [
            'employee_id' => [
                'required',
                'integer',
                Rule::exists('employees', 'id')
                    ->where('status', 'active')
                    ->where('specialty', $shift->specialty),
            ],
        ];
    }
}
