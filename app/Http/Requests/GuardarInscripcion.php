<?php

namespace App\Http\Requests;

use App\Support\Ajustes;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

// Registro público (resources/js/components/Inscripcion.jsx): solo datos personales y categoría.
// El pago se sube después desde "Mi cuenta" (ver GuardarPago).
// Los nombres de los campos coinciden para que cada error aparezca debajo de su campo.
class GuardarInscripcion extends FormRequest
{
    // Con las inscripciones cerradas solo pueden registrar quienes tienen sesión en el panel (para probar)
    public function authorize(): bool
    {
        return Ajustes::puedeInscribir();
    }

    protected function failedAuthorization(): void
    {
        throw new AuthorizationException('Las inscripciones aún no están abiertas. Vuelve pronto.');
    }

    public function rules(): array
    {
        return [
            'nombres' => ['required', 'string', 'max:100', "regex:/^[\\pL' -]+$/u"],
            'apellidos' => ['required', 'string', 'max:100', "regex:/^[\\pL' -]+$/u"],
            'documento' => ['required', 'regex:/^(\d{8}|[A-Za-z0-9]{6,12})$/'],
            'telefono' => ['required', 'regex:/^\+?[\d\s-]{7,20}$/'],
            'correo' => ['required', 'email', 'max:254'],
            'institucion' => ['nullable', 'string', 'max:200'],
            'tipo_participante' => ['required', Rule::in(array_keys(config('congreso.tarifas')))],
            'acepta_privacidad' => ['accepted'],
        ];
    }

    public function messages(): array
    {
        return [
            'nombres.required' => 'Escribe tus nombres.',
            'nombres.regex' => 'Los nombres solo pueden llevar letras y espacios.',
            'apellidos.required' => 'Escribe tus apellidos.',
            'apellidos.regex' => 'Los apellidos solo pueden llevar letras y espacios.',
            'documento.required' => 'Escribe tu DNI o pasaporte.',
            'documento.regex' => 'DNI de 8 dígitos o pasaporte de 6 a 12 caracteres, sin espacios ni guiones.',
            'telefono.required' => 'Escribe un número de celular o teléfono.',
            'telefono.regex' => 'Revisa el número: debe tener entre 7 y 15 dígitos.',
            'correo.required' => 'Escribe tu correo electrónico.',
            'correo.email' => 'El correo parece incompleto. Ejemplo: nombre@gmail.com',
            'tipo_participante.*' => 'Elige tu tipo de participante.',
            'acepta_privacidad.accepted' => 'Marca la casilla para aceptar la política de privacidad.',
        ];
    }
}
