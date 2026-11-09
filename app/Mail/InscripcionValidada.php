<?php

namespace App\Mail;

use App\Models\Inscripcion;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

// Aviso al participante cuando la organización valida (o le observa) el pago
class InscripcionValidada extends Mailable
{
    public function __construct(public Inscripcion $inscripcion) {}

    public function envelope(): Envelope
    {
        $asunto = $this->inscripcion->estado === 'validada'
            ? "Tu inscripción está confirmada ({$this->inscripcion->codigo})"
            : "Revisa tu inscripción ({$this->inscripcion->codigo})";

        return new Envelope(subject: $asunto.' – '.config('congreso.nombre_corto'));
    }

    public function content(): Content
    {
        return new Content(view: 'correos.inscripcion-validada');
    }
}
