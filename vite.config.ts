import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import vuetify from 'vite-plugin-vuetify';
// import Icons from 'unplugin-icons/vite';
// import IconsResolver from 'unplugin-icons/resolver';
// import Components from 'unplugin-vue-components/vite';
export default defineConfig((env: any) => {
  const mode = env.mode;

  return {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    plugins: [
      vue(),
      // Components({
      //   resolvers: [
      //     // 自动注册图标组件
      //     IconsResolver({
      //       enabledCollections: ['mdi'],
      //     }),
      //   ],
      // }),
      // Icons({
      //   // 自动安装图标库
      //   autoInstall: true,
      // }),
      vuetify({
        autoImport: true,
        styles: true,
      }),
    ],
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: 'http://localhost:8080',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, ''),
        },
      },
    },

    optimizedDependencies: {
      entries: ['src/main.ts'],
      include: ['vue', 'vue-router', 'pinia', 'vuetify'],
    },
    // GITHUB用
    base: '/IMSoft/',
    build: {
      cssCodeSplit: true,
      outDir: 'dist',
      SourceMap: true,
      minify: mode == 'development' ? false : 'terser',
      // 资源指纹
      assetsInlineLimit: 4096,
      assetsDir: 'assets',
      // 压缩
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
          // 手动分块
          manualChunks(id: any) {
            if (id.includes('node_modules')) {
              return 'vendor';
            }
            if (id.includes('vuetify')) {
              return 'vuetify';
            }
          },
        },
      },
    },
  };
});
