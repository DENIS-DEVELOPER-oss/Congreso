<?php

namespace App\Mail;

use App\Models\Ponencia;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

class PonenciaRecibida extends Mailable
{
    public function __construct(public Ponencia $ponencia) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: "Recibimos tu resumen ({$this->ponencia->codigo}) – ".config('congreso.nombre_corto'));
    }

    public function content(): Content
    {
        return new Content(view: 'correos.ponencia-recibida');
    }
}
