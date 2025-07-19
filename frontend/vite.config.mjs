// vite.config.mjs
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: '.', // Asegura que el index.html esté en la raíz del proyecto
  server: {
    port: 8080,
    open: '/index.html',
    strictPort: true,
    fs: {
      strict: false // 🔥 Esto permite servir archivos fuera de la raíz (rutas anidadas)
    }
  },
  resolve: {
    alias: {
      '@styles': path.resolve(__dirname, 'styles'),
      '@img': path.resolve(__dirname, 'img'),
      '@js': path.resolve(__dirname, 'js'),
      '@pages': path.resolve(__dirname, 'pages')
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
});
