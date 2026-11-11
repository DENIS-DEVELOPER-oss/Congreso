<?php

namespace App\Mail;

use App\Models\Inscripcion;
use App\Models\Ponencia;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

// Constancia para quien se inscribe desde la web (con las inscripciones en línea cerradas):
// confirma que la solicitud llegó —y su resumen, si es ponente— e indica el número para consultas
class InscripcionRecibida extends Mailable
{
    public function __construct(public Inscripcion $inscripcion, public ?Ponencia $ponencia = null) {}

    public function envelope(): Envelope
    {
        $que = $this->ponencia ? 'tu inscripción y tu resumen' : 'tu inscripción';

        return new Envelope(subject: "Recibimos {$que} ({$this->inscripcion->codigo}) – ".config('congreso.nombre_corto'));
    }

    public function content(): Content
    {
        return new Content(view: 'correos.inscripcion-recibida');
    }
}
