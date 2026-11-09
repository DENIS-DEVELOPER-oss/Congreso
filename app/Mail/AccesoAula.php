<?php

namespace App\Mail;

use App\Models\Participante;
use App\Models\Sesion;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

// Confirmación de acceso al Aula virtual: usuario, contraseña temporal, programa con Google Meet y datos de pago
class AccesoAula extends Mailable
{
    public function __construct(public Participante $participante, public string $clave) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Aula virtual: confirmación de acceso – '.config('congreso.nombre_corto'));
    }

    public function content(): Content
    {
        return new Content(view: 'correos.acceso-aula', with: ['sesiones' => Sesion::enOrden()->get()]);
    }
}
