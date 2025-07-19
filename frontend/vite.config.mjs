// vite.config.mjs
import { defineConfig } from 'vite';
import path from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  root: '.', // Asegura que el index.html esté en la raíz del proyecto
  server: {
    port: 8080,
    open: '/index.html',
    strictPort: true,
    fs: {
      strict: false // Permite servir archivos fuera de la raíz
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
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'pages',  // carpeta que quieres copiar
          dest: ''       // copia directamente en la raíz del dist
        }
      ]
    })
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
});
