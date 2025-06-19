import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import Pinia from './store';
import { createVuetify } from 'vuetify';
import 'vuetify/lib/styles/main.css';
import '@mdi/font/css/materialdesignicons.css';

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

app.use(vuetify);

// 挂载
app.mount('#app');
