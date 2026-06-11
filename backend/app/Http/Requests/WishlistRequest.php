<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class WishlistRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'  => ['required', 'string', 'max:100'],
            'email' => ['required', 'email:rfc', 'max:255', 'unique:wishlist_entries,email'],
        ];
    }

    public function messages(): array
    {
        return [
            'email.unique' => 'This email is already on the wishlist.',
        ];
    }
}
