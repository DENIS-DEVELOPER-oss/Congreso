<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

// Solicitud de inscripción mientras el registro en línea está cerrado (Inscripcion.jsx → FormSolicitud).
// Asistente: datos personales y categoría. Ponente: además su resumen con la plantilla oficial (obligatorio).
class GuardarSolicitud extends FormRequest
{
    public function rules(): array
    {
        $ponente = $this->input('tipo') === 'ponente';

        return [
            'tipo' => ['required', Rule::in(['asistente', 'ponente'])],
            'nombres' => ['required', 'string', 'max:100', "regex:/^[\\pL' -]+$/u"],
            'apellidos' => ['required', 'string', 'max:100', "regex:/^[\\pL' -]+$/u"],
            'documento' => ['required', 'regex:/^(\d{8}|[A-Za-z0-9]{6,12})$/'],
            'telefono' => ['required', 'regex:/^\+?[\d\s-]{7,20}$/'],
            'correo' => ['required', 'email', 'max:254'],
            'institucion' => ['nullable', 'string', 'max:200'],
            'tipo_participante' => $ponente ? ['nullable'] : ['required', Rule::in(['estudiante', 'docente', 'profesional'])],
            'acepta_privacidad' => ['accepted'],
            // El eje llega por su número de mesa (orden), igual que en la convocatoria
            'eje' => $ponente ? ['required', 'integer', 'exists:ejes_tematicos,orden'] : ['nullable'],
            'titulo' => $ponente ? ['required', 'string', 'min:10', 'max:200'] : ['nullable'],
            'palabras_clave' => $ponente ? ['required', 'string', 'max:250', function ($campo, $valor, $falla) {
                $n = count(array_filter(array_map('trim', preg_split('/[;,]/', $valor))));
                if ($n !== 5) {
                    $falla('Escribe 5 palabras clave separadas por punto y coma.');
                }
            }] : ['nullable'],
            'coautores' => ['nullable', 'string', 'max:1000'],
            'archivo' => $ponente ? ['required', 'file', 'mimes:pdf,doc,docx', 'max:5120'] : ['prohibited'],
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
            'eje.*' => 'Elige la mesa temática de tu ponencia.',
            'titulo.required' => 'Escribe el título de tu ponencia.',
            'titulo.min' => 'El título es muy corto: usa al menos 10 caracteres.',
            'titulo.max' => 'El título puede tener hasta 200 caracteres.',
            'palabras_clave.required' => 'Escribe 5 palabras clave separadas por punto y coma.',
            'archivo.required' => 'Adjunta tu resumen con la plantilla oficial (Word o PDF).',
            'archivo.mimes' => 'El resumen debe ser Word (.doc o .docx) o PDF.',
            'archivo.max' => 'El archivo pesa más de 5 MB.',
            'archivo.*' => 'No se pudo recibir el archivo. Inténtalo de nuevo.',
        ];
    }
}
