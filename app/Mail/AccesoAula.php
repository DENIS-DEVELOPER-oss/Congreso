<?php

namespace App\Mail;

use App\Models\Participante;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

// Acceso al Aula virtual: usuario, contraseña temporal y botón para ingresar
class AccesoAula extends Mailable
{
    public function __construct(public Participante $participante, public string $clave) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Tu acceso al Aula virtual – '.config('congreso.nombre_corto'));
    }

    public function content(): Content
    {
        return new Content(view: 'correos.acceso-aula');
    }
}
