import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Cada página pública del congreso es una entrada de React (ver resources/views/sitio.blade.php).
// El panel de organizadores (/admin) usa sus propios estilos de Filament.
export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/js/main.jsx', 'resources/js/paginas/inscripcion.jsx', 'resources/js/paginas/cuenta.jsx'],
            refresh: true,
        }),
        react(),
        tailwindcss(),
    ],
    server: {
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
    },
});
