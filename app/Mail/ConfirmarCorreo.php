<?php

namespace App\Mail;

use App\Models\Participante;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

// Enlace para confirmar el correo (se reenvía desde el panel; la constancia de inscripción ya lo incluye)
class ConfirmarCorreo extends Mailable
{
    public function __construct(public Participante $participante) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Confirma tu correo – '.config('congreso.nombre_corto'));
    }

    public function content(): Content
    {
        return new Content(view: 'correos.confirmar-correo');
    }
}
