<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateStatRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'label' => ['required', 'string', 'max:255'],
            'value' => ['required', 'string', 'max:50'],
            'icon' => ['nullable', 'string', 'max:100'],
            'icon_path' => ['nullable', 'string'],
            'icon_image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:512'],
            'position' => ['required', 'integer', 'min:0'],
            'is_active' => ['required', 'boolean'],
        ];
    }
}
