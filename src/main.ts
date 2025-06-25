import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import Pinia from './store';
import { createVuetify } from 'vuetify';
import 'vuetify/lib/styles/main.css';
import '@mdi/font/css/materialdesignicons.css';
import { marked } from 'marked';

const app = createApp(App);

app.use(Pinia);

const vuetify = createVuetify({
  icons: {
    defaultSet: 'mdi',
  },
  // 主题配置（可选）
  theme: {
    defaultTheme: 'light', // 默认主题（light/dark/custom）
    themes: {
      light: {
        colors: {
          primary: '#4CAF50', // 自定义主色
          secondary: '#FFC107',
        },
      },
    },
  },
});

marked.setOptions({
  gfm: true, // 启用 GitHub 风格 Markdown
  breaks: true, // 将换行符转换为 <br>（默认 false）
  pedantic: false, // 不使用原始 markdown.pl（默认 false）
});

app.use(vuetify);

// 挂载
app.mount('#app');
