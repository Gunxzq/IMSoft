import { defineConfig } from 'vite';

import vue from '@vitejs/plugin-vue';
import path from 'path';

// https://vite.dev/config/
export default defineConfig((command, mode) => {
  // const env = loadEnv(mode, process.cwd());
  return {
    resolve: {
      '@': path.resolve('./src'),
    },
    plugins: [vue()],
    server: {
      port: 5173,
    },
  };
});
