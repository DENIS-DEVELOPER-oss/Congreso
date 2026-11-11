<?php

namespace App\Mail;

use App\Models\Ponencia;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

// Resultado de la evaluación del resumen: aceptado, observado (con lo que debe corregir) o rechazado
class ResultadoPonencia extends Mailable
{
    public function __construct(public Ponencia $ponencia) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: "Resultado de tu resumen ({$this->ponencia->codigo}) – ".config('congreso.nombre_corto'));
    }

    public function content(): Content
    {
        return new Content(view: 'correos.resultado-ponencia');
    }
}
