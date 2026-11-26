<?php

namespace App\Mail;

use App\Models\Inscripcion;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

// Recordatorio a cada inscrito: fecha, ingreso desde las 8:00 y registro de entrada y salida con su DNI
class RecordatorioAsistencia extends Mailable
{
    public const DIAS = [
        'ambos' => 'Los dos días (26 y 27 de noviembre)',
        '27' => 'Solo el segundo día (viernes 27 de noviembre)',
    ];

    public function __construct(public Inscripcion $inscripcion, public string $dia = 'ambos') {}

    public function envelope(): Envelope
    {
        $cuando = $this->dia === '27' ? 'viernes 27 de noviembre' : '26 y 27 de noviembre';

        return new Envelope(subject: "Recordatorio de asistencia: {$cuando}, ingreso desde las 8:00 a. m. – ".config('congreso.nombre_corto'));
    }

    public function content(): Content
    {
        return new Content(view: 'correos.recordatorio-asistencia');
    }
}
