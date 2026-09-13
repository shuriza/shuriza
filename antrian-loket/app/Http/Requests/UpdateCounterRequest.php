<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCounterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'service_id' => ['required', 'integer', 'exists:services,id'],
            'operator_name' => ['nullable', 'string', 'max:255'],
            'is_open' => ['required', 'boolean'],
        ];
    }

    protected function prepareForValidation(): void
    {
        $operatorName = trim((string) $this->input('operator_name'));

        $this->merge([
            'name' => trim((string) $this->input('name')),
            'operator_name' => $operatorName === '' ? null : $operatorName,
            'is_open' => $this->boolean('is_open'),
        ]);
    }
}
