<?php

namespace App\Http\Requests\Admin;

use App\Concerns\PasswordValidationRules;
use Illuminate\Foundation\Http\FormRequest;

class SetUserPasswordRequest extends FormRequest
{
    use PasswordValidationRules;

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'password' => $this->passwordRules(),
        ];
    }
}
