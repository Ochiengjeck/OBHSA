<?php

namespace App\Http\Requests;

use App\Support\CaregiverSpecialties;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateApplicationPreferencesRequest extends FormRequest
{
    /**
     * Employment types a candidate may select, matching JobListing's
     * stored vocabulary plus candidate-only options.
     *
     * @var list<string>
     */
    public const array EMPLOYMENT_TYPES = ['per-diem', 'prn', 'full-time', 'part-time', 'contract', 'flexible'];

    /**
     * @var list<string>
     */
    public const array START_TIMEFRAMES = ['immediately', 'within_2_weeks', 'within_1_month', 'flexible'];

    /**
     * @var list<string>
     */
    public const array WORK_SETTINGS = [
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
            'primary_specialty' => ['required', 'string', Rule::in(array_keys(CaregiverSpecialties::OPTIONS))],
            'secondary_specialty' => ['nullable', 'string', Rule::in(array_keys(CaregiverSpecialties::OPTIONS))],
            'desired_employment_type' => ['required', 'string', Rule::in(self::EMPLOYMENT_TYPES)],
            'desired_start_timeframe' => ['required', 'string', Rule::in(self::START_TIMEFRAMES)],
            'work_settings' => ['present', 'array'],
            'work_settings.*' => ['string', Rule::in(self::WORK_SETTINGS)],
        ];
    }
}
