import { build, defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import vuetify from 'vite-plugin-vuetify';
// https://vite.dev/config/
export default defineConfig((command, mode) => {
  // const env = loadEnv(mode, process.cwd());
  return {
    resolve: {
      '@': path.resolve('./src'),
    },
    plugins: [
      vue(),
      vuetify({
        autoImport: true,
        styles: true,
      }),
    ],
    server: {
      port: 5173,
    },
    build: {
      outDir: 'dist',
      SourceMap: true,
    },
  };
});
