# Congreso Saberes Andino-Amazónicos — sistema web

Laravel 12 + Filament 5 (panel de organización) + React/Vite (diseño de la página) + MySQL.

| Dirección | Qué es |
|---|---|
| `/` | Página principal |
| `/inscripcion` | Registro público y gratuito: solo datos personales y categoría |
| `/aula` | Aula virtual: sesiones por Google Meet, envío de resúmenes y certificados (usuario = DNI o correo) |
| `/verificar/CODIGO` | Comprueba si un certificado es auténtico (a esta página lleva el QR del PDF) |
| `/admin` | Panel de organización (solo con usuario y contraseña) |

## El congreso según los afiches

- **Modalidad presencial y virtual**: sede en el campus de la UNA Puno y transmisión por Google Meet.
- **Inscripción gratuita**: al registrarse, la inscripción queda **confirmada al instante** (sin pago ni voucher)
  y la persona ve los enlaces de Google Meet en el Aula virtual.
  Se controla en *Datos del congreso → Inscripción y pagos → La inscripción es gratuita*; si algún día se desactiva,
  vuelven las tarifas, los medios de pago y la validación de vouchers.
- **Resúmenes hasta el 20 de noviembre**: 250 palabras, plantilla oficial, **5 palabras clave**, ponencia presencial o virtual.
- Los **6 ejes oficiales** se cargan con `php artisan migrate --seed` (editables en *Ejes temáticos*).
- Afiches en `public/media/afiches/`, plantilla del resumen y bases en `public/descargas/`.
  El afiche de convocatoria está retirado por ahora (le faltan datos): queda en `imagenes/pendientes/`.
  Para volver a publicarlo, cópialo a `public/media/afiches/` y agrégalo en `resources/js/data/afiches.js`.

## Abrir las inscripciones

Las inscripciones están **cerradas** por defecto: la página muestra «Inscripciones muy pronto».
- **Para probar el formulario**: inicia sesión en `/admin` y, en el mismo navegador, abre `/inscripcion`;
  verás un aviso de *Modo de prueba* y podrás registrar personas de prueba (bórralas después en *Inscripciones*).
- **Para abrirlas al público**: *Configuración → Datos del congreso → Inscripción y pagos →
  Inscripciones abiertas al público* y guarda.

## Ponentes centrales

*Académico → Ponentes centrales*: los organizadores agregan, editan, ordenan (arrastrando) u ocultan ponentes,
con foto (se guarda en `public/ponentes/`). Los cambios aparecen al instante en la página.
Para registrar **participantes**, usa *Inscripciones → Inscribir manualmente* (funciona aunque las inscripciones públicas estén cerradas).

## Datos reales del congreso

Entra al panel como administrador → **Configuración → Datos del congreso** y completa:
correo, teléfono y WhatsApp, fechas importantes, firmantes del certificado (con imagen de la firma),
horas académicas y % de asistencia. La página, los correos y los certificados se actualizan solos al guardar.

## Flujo del congreso

1. La persona se **registra** en `/inscripcion` (nombre, DNI, celular, correo y categoría).
2. **Al instante** le llega el correo *"Aula virtual: confirmación de acceso"*: usuario (DNI o correo), **contraseña temporal**,
   botón *Ingresar al aula* y el **programa** con horarios y enlaces de Google Meet.
3. En el **Aula virtual** (`/aula`) entra con su DNI o correo; la primera vez crea su propia contraseña (eso también confirma su correo).
   Ahí ve sus sesiones con el botón **Unirse por Google Meet**, envía resúmenes y descarga certificados.
4. En el panel, **Asistencia → Sesiones**: carga el tema, ponente, horario y **enlace de Google Meet** de cada sesión.
5. **Asistencia → Registrar asistencia**: en el campus con el código o el DNI, uno por uno; en línea, pegando la lista
   de DNI/correos del reporte de asistentes de Google Meet.
6. **Certificados**: se emiten a quienes cumplen el % de asistencia y se envían por correo.

**Reenviar acceso** (en Inscripciones o Participantes) genera una contraseña temporal nueva y vuelve a enviar el correo.

## Confirmación de correo

Cada constancia trae el botón **Confirmar mi correo**. En el panel (Inscripciones y Participantes)
se ve quién confirmó y se puede reenviar el enlace. Si alguien cambia de correo, debe confirmarlo otra vez.

## Inscripción manual

Inscripciones → **Inscribir manualmente**: para quien llega al campus sin haberse registrado.
Escribe el DNI (si ya estaba registrado se completan sus datos) y, si quieres, se le envía su acceso al aula.

## Dónde está cada cosa

| Carpeta / archivo | Contenido |
|---|---|
| `resources/js/` | Diseño de la página (React). Textos y datos en `resources/js/data/` |
| `config/congreso.php` | Valores por defecto (lo que se guarda en el panel los reemplaza) |
| `database/migrations/2026_11_09_000001_crear_tablas_del_congreso.php` | Las 7 tablas |
| `app/Filament/` | Panel de organización |
| `resources/views/certificados/pdf.blade.php` | Diseño del certificado PDF |
| `resources/views/correos/` | Correos que reciben los participantes |
| `storage/app/private/` | Resúmenes, firmas y PDF subidos (privados) |
| `public/media/afiches/` | Afiches oficiales (galería de la página) |


## Trabajar en tu computadora

```bash
composer install
npm install
php artisan migrate --seed          # crea las tablas, los ejes y las 4 sesiones
php artisan congreso:admin          # crea tu cuenta de administrador
npm run build
php artisan serve                   # abre http://127.0.0.1:8000
```

En local los correos no se envían: quedan escritos en `storage/logs/laravel.log`.

## Roles

- **Administrador**: todo, incluido borrar registros y crear cuentas (Configuración → Usuarios).
- **Organizador**: ve inscritos, dictamina ponencias, registra asistencia y emite y envía certificados. No borra ni crea usuarios.

## Publicar en Bluehost (cPanel) desde GitHub

El repositorio incluye el diseño ya compilado (`public/build`), así que en el servidor **no hace falta Node**;
solo PHP y Composer (Bluehost los trae por SSH).

### 1. Preparar el hosting (una sola vez)
1. **cPanel → MultiPHP Manager**: pon `congresosaberes.net` en **PHP 8.2 o superior**.
2. **cPanel → MultiPHP INI Editor**: `upload_max_filesize = 10M`, `post_max_size = 12M`.
3. **cPanel → MySQL Databases**: crea la base de datos y un usuario con contraseña, y asígnalo a la base con **todos los privilegios**.
4. **cPanel → Email Accounts**: crea `contacto@congresosaberes.net` (desde ahí salen los correos).
5. **cPanel → Email Deliverability**: activa **SPF y DKIM**; sin eso los correos suelen llegar a spam.
6. **cPanel → SSH Access**: activa el acceso SSH.

### 2. Descargar el código desde GitHub (por SSH)
```bash
ssh USUARIO@50.6.61.88
cd ~
git clone https://github.com/DENIS-DEVELOPER-oss/Congreso.git congreso
```
Si el repositorio es **privado**, GitHub pedirá usuario y un *token* en lugar de la contraseña
(GitHub → Settings → Developer settings → Personal access tokens → *Fine-grained*, con permiso de lectura de *Contents* en ese repositorio).

### 3. Instalar dependencias y configurar `.env`
```bash
cd ~/congreso
composer install --no-dev --optimize-autoloader     # si "composer" no existe: php ~/composer.phar ...
cp .env.produccion.example .env
nano .env        # completa base de datos y contraseña del correo (valores entre < >)
php artisan key:generate
php artisan migrate --seed --force    # tablas, 6 ejes, 11 ponentes y 4 sesiones
php artisan congreso:admin            # crea el administrador (pide correo, nombre y contraseña)
php artisan optimize
php artisan filament:optimize
chmod -R 775 storage bootstrap/cache public/ponentes
```
Si `php -v` muestra una versión menor a 8.2, usa `/usr/local/bin/ea-php82` en lugar de `php`.

### 4. Hacer que el dominio muestre Laravel
```bash
mv ~/public_html ~/public_html_anterior      # respaldo de lo que había
ln -s ~/congreso/public ~/public_html
```
Así el dominio sirve solo la carpeta `public` y el resto del código queda fuera del alcance de los visitantes.
Abre `https://congresosaberes.net` y entra al panel en `https://congresosaberes.net/admin`.

### Cuando cambies algo después
En tu computadora:
```bash
npm run build                      # si cambiaste el diseño
git add -A
git commit -m "Describe el cambio"
git push
```
En el servidor:
```bash
cd ~/congreso
git pull
composer install --no-dev --optimize-autoloader
php artisan migrate --force
php artisan optimize
```

### Alternativa sin GitHub
`E:\CONGRESO_SOCIOLOGIA\despliegue\congreso-bluehost.zip` trae el mismo código con `vendor` incluido:
súbelo con el Administrador de archivos a `/home/USUARIO/`, descomprímelo y sigue desde `cp .env.produccion.example .env` (paso 3, sin `composer install`).

### Copias de seguridad
**cPanel → Backup**: descarga la base de datos y la carpeta `congreso/storage/app/private` (resúmenes y firmas) al menos una vez por semana, y a diario durante el congreso.

## Rendimiento del servidor (VPS con nginx)

`deploy/nginx-congreso-rendimiento.conf` activa la compresión de JS y CSS (unas 3 veces más livianos) y la caché del navegador: los archivos de `public/build` se guardan un año (llevan huella en el nombre) y las imágenes un día. Se instala una sola vez:

```bash
sudo cp /var/www/congreso/deploy/nginx-congreso-rendimiento.conf /etc/nginx/snippets/
sudo sed -i 's#^\(\s*\)root /var/www/congreso/public;#&\n\1include snippets/nginx-congreso-rendimiento.conf;#' /etc/nginx/sites-available/congreso
sudo nginx -t && sudo systemctl reload nginx
```

Si `nginx -t` muestra un error, no se recarga nada y el sitio sigue funcionando como antes.
