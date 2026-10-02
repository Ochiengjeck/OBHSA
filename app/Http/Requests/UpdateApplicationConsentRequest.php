<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateApplicationConsentRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'information_accurate' => ['accepted'],
            'background_check_consent' => ['accepted'],
            'signature_name' => ['required', 'string', 'max:255'],
        ];
    }
}
