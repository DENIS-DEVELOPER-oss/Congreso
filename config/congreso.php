<?php

// Datos del congreso. Lo marcado como EDITABLE se cambia desde el panel (Configuración → Datos del congreso);
// estos valores solo se usan mientras no se haya guardado nada ahí. Ver App\Support\Ajustes.
return [

    'nombre' => 'I Congreso Internacional: Saberes Andinos y Amazónicos y Diálogo Intercultural en la Educación Superior Universitaria',
    'nombre_corto' => 'Congreso Saberes Andinos y Amazónicos',
    'fechas_texto' => '26 y 27 de noviembre de 2026',
    'fecha_inicio' => '2026-11-26T08:00:00-05:00',
    'fecha_fin' => '2026-11-27T19:00:00-05:00',
    'ciudad' => 'Puno, Perú', // sede de la organización
    'modalidad' => 'Presencial',
    'sede' => 'Educación Continua UNA Puno',
    'organiza' => 'Escuela Profesional de Sociología · Instituto de Investigaciones para el Desarrollo Social Andino (IIDSA) · Universidad Nacional del Altiplano',

    // Prefijo de los códigos de inscripción: SA-2026-0001
    'prefijo_codigo' => 'SA-2026',

    // EDITABLE. Inscripciones abiertas al público. Cerradas: el formulario muestra "muy pronto"
    // y solo los usuarios del panel (con sesión iniciada) pueden probarlo.
    'inscripciones_abiertas' => false,

    // EDITABLE. Inscripción gratuita: al registrarse queda confirmada, sin pago ni voucher (como indican los afiches)
    'inscripcion_gratuita' => true,

    // EDITABLE. Hasta esta fecha rige la tarifa de preventa (null = solo tarifa regular)
    'fecha_preventa_fin' => null,

    // EDITABLE. Montos en soles por tipo de participante. El servidor calcula el monto: no se confía en el navegador.
    // nombre: singular (panel y correos) · titulo: plural (tarjeta de la página)
    'tarifas' => [
        'estudiante' => ['nombre' => 'Estudiante', 'titulo' => 'Estudiantes', 'detalle' => 'Pregrado con carné universitario vigente', 'preventa' => 30, 'regular' => 50],
        'docente' => ['nombre' => 'Docente', 'titulo' => 'Docentes', 'detalle' => 'Docentes universitarios y de educación básica', 'preventa' => 80, 'regular' => 120],
        'profesional' => ['nombre' => 'Profesional', 'titulo' => 'Profesionales', 'detalle' => 'Público general y egresados', 'preventa' => 100, 'regular' => 150],
        'ponente' => ['nombre' => 'Ponente', 'titulo' => 'Ponentes', 'detalle' => 'Incluye publicación en el libro de resúmenes', 'preventa' => 120, 'regular' => 180],
    ],

    // EDITABLE. Medios de pago que ve el participante (datos de ejemplo)
    'medios_pago_detalle' => [
        ['id' => 'yape', 'nombre' => 'Yape', 'etiqueta' => 'Número', 'dato' => '951 000 000', 'titular' => 'Escuela Prof. de Sociología – UNA'],
        ['id' => 'plin', 'nombre' => 'Plin', 'etiqueta' => 'Número', 'dato' => '951 000 000', 'titular' => 'Escuela Prof. de Sociología – UNA'],
        ['id' => 'bn', 'nombre' => 'Banco de la Nación', 'etiqueta' => 'Cuenta corriente', 'dato' => '00-000-000000', 'titular' => 'Universidad Nacional del Altiplano'],
        ['id' => 'cci', 'nombre' => 'Transferencia (CCI)', 'etiqueta' => 'Código interbancario', 'dato' => '018-000-000000000000-00', 'titular' => 'Universidad Nacional del Altiplano'],
    ],

    // id => nombre de los medios de pago (se arma solo a partir de medios_pago_detalle)
    'medios_pago' => [
        'yape' => 'Yape',
        'plin' => 'Plin',
        'bn' => 'Banco de la Nación',
        'cci' => 'Transferencia (CCI)',
    ],

    // Medios que solo usa la organización al inscribir manualmente desde el panel
    'medios_pago_panel' => [
        'efectivo' => 'Otro (registrado por la organización)',
    ],

    'modalidades' => [
        'presencial' => 'Ponencia presencial',
    ],

    // EDITABLE. Contacto que se muestra en la página y en los correos
    'correo_contacto' => env('CONGRESO_CORREO', 'p.enriquez@unap.edu.pe'),
    'telefono' => '+51 930 805 537',
    'whatsapp' => '51930805537', // solo dígitos, con código de país

    // EDITABLE. Avisos a la comisión por cada nueva inscripción (panel → Datos del congreso → Avisos).
    // Correo: si está vacío, se usa el correo de contacto. WhatsApp: con CallMeBot (callmebot.com),
    // que envía mensajes gratis al número que lo activó; sin la clave, no se envía por WhatsApp.
    'aviso_correo' => env('AVISO_CORREO'),
    'aviso_whatsapp' => env('AVISO_WHATSAPP', '51930805537'),
    'aviso_whatsapp_clave' => env('AVISO_WHATSAPP_CLAVE'),

    // EDITABLE. Fechas importantes de la portada (fecha AAAA-MM-DD, en orden)
    'fechas_importantes' => [
        ['fecha' => '2026-11-20', 'texto' => 'Cierre de recepción de resúmenes'],
        ['fecha' => '2026-11-26', 'texto' => 'Inauguración y primer día del congreso'],
        ['fecha' => '2026-11-27', 'texto' => 'Segundo día y clausura'],
    ],

    // EDITABLE. Firmas del certificado (firma: imagen PNG opcional, se sube desde el panel)
    'firmantes' => [
        ['nombre' => null, 'cargo' => 'Director(a) de la Escuela Profesional de Sociología', 'firma' => null],
        ['nombre' => null, 'cargo' => 'Director(a) del Instituto de Investigaciones para el Desarrollo Social Andino (IIDSA)', 'firma' => null],
    ],

    // EDITABLE. Si es true, el enlace de las sesiones solo se muestra en el Aula a quienes tienen el pago validado
    'zoom_solo_con_pago' => true,

    // EDITABLE. Certificados
    'porcentaje_asistencia' => 80, // % mínimo de sesiones asistidas para el certificado de asistente
    'horas' => [
        'asistente' => 48,
        'ponente' => 48,
        'organizador' => 60,
        'comite' => 60,
    ],

    // Cloudflare Turnstile (opcional): si hay clave secreta, se exige la verificación anti-bots
    'turnstile_secret' => env('TURNSTILE_SECRET'),

    // Clave del instalador web (/api/instalar). Vacía = instalador apagado
    'instalador_clave' => env('INSTALADOR_CLAVE', ''),
];
