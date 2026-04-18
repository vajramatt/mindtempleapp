import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

export default defineConfig({
  plugins: [preact()],
  server: { port: 4777, strictPort: true },
  build: { target: 'es2022', sourcemap: true },
});
