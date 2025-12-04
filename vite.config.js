import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl';

export default defineConfig({
  plugins: [glsl()],
  server: {
    host: true,     // 👈 allows external devices (mobile) to access
    port: 5173      // 👈 make sure you're using the correct port
  }
});

