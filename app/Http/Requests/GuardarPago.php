<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

// Voucher de pago que el participante sube desde "Mi cuenta"
class GuardarPago extends FormRequest
{
    public function rules(): array
    {
        $propia = $this->user('participante')?->inscripcion?->id;

        return [
            'medio_pago' => ['required', Rule::in(array_keys(config('congreso.medios_pago')))],
            'numero_operacion' => [
                'required', 'string', 'max:30',
                // El mismo número de operación no puede usarse en otra inscripción
                Rule::unique('inscripciones')->where('medio_pago', $this->input('medio_pago'))->ignore($propia),
            ],
            'voucher' => ['required', 'file', 'mimes:jpg,jpeg,png,webp,pdf', 'max:5120'],
        ];
    }

    public function messages(): array
    {
        return [
            'medio_pago.*' => 'Elige el medio con el que hiciste el pago.',
            'numero_operacion.required' => 'Escribe el número de operación que aparece en tu voucher.',
            'numero_operacion.unique' => 'Este número de operación ya fue registrado en otra inscripción. Si es un error, escríbenos.',
            'voucher.required' => 'Adjunta la foto o el PDF de tu voucher.',
            'voucher.mimes' => 'El voucher debe ser JPG, PNG, WEBP o PDF.',
            'voucher.max' => 'El voucher pesa más de 5 MB.',
            'voucher.*' => 'No se pudo recibir el archivo del voucher. Inténtalo de nuevo.',
        ];
    }
}
