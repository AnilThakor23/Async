import { defineConfig } from 'vite';
import { resolve } from 'path';
import glsl from 'vite-plugin-glsl';

export default defineConfig(({ mode }) => {
  const basePath = mode === 'production' ? '/Async/' : '/';
 
  return {
    root: '.',
    plugins: [glsl()],
    base: basePath,
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'index.html'),
          works: resolve(__dirname, 'works.html'),
          about: resolve(__dirname, 'about.html'),
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
  };
});

