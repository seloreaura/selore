import { defineConfig } from 'vite';

// No react plugin to keep runtime deps minimal.
// Vite + esbuild will still handle JSX with TS using the automatic runtime.
export default defineConfig({
  server: { port: 5173, open: true },
  preview: { port: 5173 }
});
