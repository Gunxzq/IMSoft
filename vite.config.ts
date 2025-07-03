import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import vuetify from 'vite-plugin-vuetify';
export default defineConfig((env: any) => {
  // const env = loadEnv(mode, process.cwd());
  const mode = env.mode;
  // const command = env.command;
  return {
    alias: {
      '@': path.resolve(__dirname, '.src'),
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

    optimizedDependencies: {
      csscodesplit: true,
      entries: ['src/main.ts'],
      include: ['vue', 'vue-router', 'pinia', 'vuetify'],
    },
    build: {
      outDir: 'dist',
      SourceMap: true,
      minify: mode == 'development' ? false : 'terser',
      // minify: 'terser',
      terserOptions: {
        compress: {
          // 移除console
          drop_console: mode == 'development' ? false : true,
          // drop_console: true,
          drop_debugger: true, // 移除 debugger
        },
        format: {
          comments: false, // 移除注释
        },
        mangle: true, // 混淆变量名
      },
      rollupOptions: {
        output: {
          // 设置缓存头
          manualChunks(id: any) {
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          },
        },
      },
    },
  };
});
