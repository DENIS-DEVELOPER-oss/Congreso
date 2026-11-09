{{-- Página que ve el participante al hacer clic en "Confirmar mi correo" --}}
<x-tarjeta-publica titulo="Confirmación de correo">
        @if ($estado === 'ok')
          <div class="icono ok">✓</div>
          <h1>¡Correo confirmado!</h1>
          <p>Gracias, {{ $participante->nombres }}. Ahora sabemos que <strong>{{ $participante->correo }}</strong> es tu correo: ahí recibirás la validación de tu pago y tu certificado.</p>
        @elseif ($estado === 'ya')
          <div class="icono ok">✓</div>
          <h1>Tu correo ya estaba confirmado</h1>
          <p>No necesitas hacer nada más, {{ $participante->nombres }}.</p>
        @else
          <div class="icono aviso">!</div>
          <h1>Este enlace ya no es válido</h1>
          <p>El correo de esta inscripción cambió después de enviarte el enlace. Revisa el mensaje más reciente que te enviamos o escríbenos a {{ config('congreso.correo_contacto') }}.</p>
        @endif
</x-tarjeta-publica>
