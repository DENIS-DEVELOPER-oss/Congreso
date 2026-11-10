#!/usr/bin/env bash
# Actualiza el congreso en el VPS con lo último de GitHub:
#   bash /var/www/congreso/actualizar.sh
# No borra datos: inscripciones, ponentes, fotos subidas y el .env se conservan.
set -euo pipefail
cd "$(dirname "$0")"

# Si algo falla a mitad de camino, el sitio vuelve a estar en línea de todos modos
trap 'php artisan up >/dev/null 2>&1 || true' EXIT

# Los permisos de las carpetas (chmod) no cuentan como cambios para git
git config core.fileMode false

php artisan down --retry=15 || true
git pull --ff-only
COMPOSER_ALLOW_SUPERUSER=1 composer install --no-dev --optimize-autoloader --no-interaction
php artisan migrate --force
php artisan optimize
php artisan filament:optimize
chown -R www-data:www-data storage bootstrap/cache public/ponentes
php artisan up

echo "Listo: congreso actualizado ($(git log -1 --format='%h %s'))"
