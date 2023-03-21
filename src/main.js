import { createApp } from 'vue';
import App from './App.vue';
import api from './api';
import { createPinia } from 'pinia';
import router from './router';

const app = createApp(App);
const pinia = createPinia();
app.provide('$api', api);
app.use(pinia).use(router).mount('#app');
