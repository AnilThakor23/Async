import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss(), glsl()],
  base: '/',
  build: {
    rollupOptions: {
      input: {
        index: 'index.html',
        works: 'works.html',
        about: 'about.html',
      },
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('three')) return 'vendor_three';
            if (id.includes('gsap')) return 'vendor_gsap';
            if (id.includes('troika-three-text')) return 'vendor_troika';
            return 'vendor';
          }
        }
      }
    },
    chunkSizeWarningLimit: 800
  }
});

