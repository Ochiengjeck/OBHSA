<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateOnboardingChecklistTemplateItemRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'task_key' => ['required', 'string', 'max:100', 'alpha_dash'],
            'label' => ['required', 'string', 'max:255'],
            'is_blocking' => ['boolean'],
            'position' => ['integer', 'min:0'],
        ];
    }
}
