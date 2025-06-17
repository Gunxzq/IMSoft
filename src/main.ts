import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import Pinia from './store';
// import globalStore from './store/globalStore';

const app = createApp(App);

app.use(Pinia);
// app.use(globalStore);

// 挂载
app.mount('#app');
