<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePageRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string', 'max:500'],
            'is_published' => ['required', 'boolean'],
            'sections' => ['required', 'array'],
            'sections.*.id' => ['required', 'integer', 'exists:page_sections,id'],
            'sections.*.is_visible' => ['required', 'boolean'],
            'sections.*.position' => ['required', 'integer', 'min:0'],
            'sections.*.content' => ['required', 'array'],
        ];
    }
}
