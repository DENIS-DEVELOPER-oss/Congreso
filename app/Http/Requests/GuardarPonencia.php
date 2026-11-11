<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

// Envío de resúmenes desde "Mi cuenta": el autor es el participante que inició sesión
class GuardarPonencia extends FormRequest
{
    public function rules(): array
    {
        return [
            'titulo' => ['required', 'string', 'min:10', 'max:200'],
            'eje' => ['required', 'integer', 'exists:ejes_tematicos,id'],
            'modalidad' => ['required', Rule::in(array_keys(config('congreso.modalidades')))],
            'coautores' => ['nullable', 'string', 'max:1000'],
            'palabras_clave' => ['required', 'string', 'max:250', function ($campo, $valor, $falla) {
                $n = count(array_filter(array_map('trim', preg_split('/[;,]/', $valor))));
                if ($n !== 5) {
                    $falla('Escribe 5 palabras clave separadas por punto y coma.');
                }
            }],
            'archivo' => ['required', 'file', 'mimes:pdf,doc,docx', 'max:5120'],
        ];
    }

    public function messages(): array
    {
        return [
            'titulo.required' => 'Escribe el título de tu trabajo.',
            'titulo.min' => 'El título es muy corto: usa al menos 10 caracteres.',
            'titulo.max' => 'El título puede tener hasta 200 caracteres.',
            'eje.*' => 'Elige el eje temático en el que encaja tu trabajo.',
            'modalidad.*' => 'La ponencia se presenta de forma presencial.',
            'palabras_clave.required' => 'Escribe 5 palabras clave separadas por punto y coma.',
            'archivo.required' => 'Adjunta tu resumen en PDF o Word.',
            'archivo.mimes' => 'El resumen debe ser PDF o Word (.doc o .docx).',
            'archivo.max' => 'El archivo pesa más de 5 MB.',
            'archivo.*' => 'No se pudo recibir el archivo. Inténtalo de nuevo.',
        ];
    }
}
