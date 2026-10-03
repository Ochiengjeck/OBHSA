<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class StoreJobListingRequest extends FormRequest
{
    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'slug' => Str::slug($this->string('title')).'-'.Str::lower(Str::random(6)),
            'shift' => $this->filled('shift') ? $this->input('shift') : null,
            'pay_range_min' => $this->filled('pay_range_min') ? $this->input('pay_range_min') : null,
            'pay_range_max' => $this->filled('pay_range_max') ? $this->input('pay_range_max') : null,
            'closes_at' => $this->filled('closes_at') ? $this->input('closes_at') : null,
        ]);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', Rule::unique('job_listings', 'slug')],
            'specialty' => ['required', 'string', 'max:100'],
            'employment_type' => ['required', Rule::in(['per-diem', 'prn', 'full-time', 'part-time', 'contract'])],
            'location_city' => ['required', 'string', 'max:100'],
            'location_state' => ['required', 'string', 'max:2'],
            'shift' => ['nullable', Rule::in(['day', 'evening', 'night', 'rotating'])],
            'pay_range_min' => ['nullable', 'numeric', 'min:0'],
            'pay_range_max' => ['nullable', 'numeric', 'min:0', 'gte:pay_range_min'],
            'description' => ['required', 'string'],
            'requirements' => ['nullable', 'string'],
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'is_active' => ['required', 'boolean'],
            'closes_at' => ['nullable', 'date'],
        ];
    }
}
