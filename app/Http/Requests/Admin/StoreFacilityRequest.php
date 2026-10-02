<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreFacilityRequest extends FormRequest
{
    /**
     * Facility type options, reusing Phase 2's work-setting vocabulary.
     *
     * @var list<string>
     */
    public const array FACILITY_TYPES = [
        'hospital', 'skilled_nursing_facility', 'assisted_living', 'home_health',
        'hospice', 'rehabilitation_center', 'other',
    ];

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'address_line1' => ['required', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:255'],
            'state' => ['required', 'string', 'max:255'],
            'postal_code' => ['required', 'string', 'max:20'],
            'contact_name' => ['nullable', 'string', 'max:255'],
            'contact_phone' => ['nullable', 'string', 'max:50'],
            'contact_email' => ['nullable', 'email', 'max:255'],
            'facility_type' => ['required', 'string', 'in:'.implode(',', self::FACILITY_TYPES)],
            'is_active' => ['boolean'],
        ];
    }
}
