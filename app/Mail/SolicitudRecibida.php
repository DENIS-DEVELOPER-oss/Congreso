<?php

namespace App\Mail;

use App\Models\Inscripcion;
use App\Models\Ponencia;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Support\Str;

// Aviso a la comisión organizadora: nueva solicitud de inscripción desde la web (con el resumen adjunto si es ponente)
class SolicitudRecibida extends Mailable
{
    public function __construct(public Inscripcion $inscripcion, public ?Ponencia $ponencia = null) {}

    public function envelope(): Envelope
    {
        $p = $this->inscripcion->participante;
        $tipo = $this->ponencia ? 'ponente' : 'asistente';

        return new Envelope(
            subject: "Nueva inscripción de {$tipo} ({$this->inscripcion->codigo}): {$p->apellidos}, {$p->nombres}",
            replyTo: [new Address($p->correo, "{$p->nombres} {$p->apellidos}")],
        );
    }

    public function content(): Content
    {
        return new Content(view: 'correos.solicitud-recibida');
    }

    public function attachments(): array
    {
        if (! $this->ponencia?->archivo) {
            return [];
        }
        $p = $this->inscripcion->participante;
        $extension = pathinfo($this->ponencia->archivo, PATHINFO_EXTENSION);

        return [
            Attachment::fromStorage($this->ponencia->archivo)
                ->as("{$this->ponencia->codigo} - Resumen - ".Str::ascii("{$p->apellidos} {$p->nombres}").".{$extension}"),
        ];
    }
}
