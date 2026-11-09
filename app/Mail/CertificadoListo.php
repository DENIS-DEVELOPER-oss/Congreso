<?php

namespace App\Mail;

use App\Models\Certificado;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

// Envía el enlace de descarga del certificado (no se adjunta el PDF para que el correo sea liviano)
class CertificadoListo extends Mailable
{
    public function __construct(public Certificado $certificado) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Tu certificado está listo – '.config('congreso.nombre_corto'));
    }

    public function content(): Content
    {
        return new Content(view: 'correos.certificado-listo');
    }
}
