<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateServiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'code' => [
                'required',
                'string',
                'max:4',
                'regex:/^[A-Z0-9]+$/',
                Rule::unique('services', 'code')->ignore($this->route('service')),
            ],
            'name' => ['required', 'string', 'max:255'],
            'estimated_minutes' => ['required', 'integer', 'min:1', 'max:240'],
            'is_active' => ['required', 'boolean'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'code' => strtoupper(trim((string) $this->input('code'))),
            'name' => trim((string) $this->input('name')),
            'is_active' => $this->boolean('is_active'),
        ]);
    }
}
