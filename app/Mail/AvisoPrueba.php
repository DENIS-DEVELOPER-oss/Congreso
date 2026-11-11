<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

// Correo de prueba desde el panel (Datos del congreso → Enviar aviso de prueba)
class AvisoPrueba extends Mailable
{
    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Aviso de prueba – '.config('congreso.nombre_corto'));
    }

    public function content(): Content
    {
        return new Content(view: 'correos.aviso-prueba');
    }
}
