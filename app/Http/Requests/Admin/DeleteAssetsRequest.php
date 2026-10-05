<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class DeleteAssetsRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'paths' => ['required', 'array', 'min:1'],
            'paths.*' => [
                'required',
                'string',
                'max:500',
                function (string $attribute, mixed $value, callable $fail) {
                    if (str_contains((string) $value, '..')) {
                        $fail('Invalid path.');
                    }
                },
            ],
        ];
    }
}
