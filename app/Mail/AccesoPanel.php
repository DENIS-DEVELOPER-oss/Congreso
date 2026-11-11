<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

// Datos de acceso al panel de organización para un usuario nuevo (organizador o administrador)
class AccesoPanel extends Mailable
{
    public function __construct(public User $usuario, public string $clave) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Tu acceso al panel de organización – '.config('congreso.nombre_corto'));
    }

    public function content(): Content
    {
        return new Content(view: 'correos.acceso-panel');
    }
}
