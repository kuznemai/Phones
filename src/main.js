import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import {createPinia} from "pinia";


// Создайте приложение и подключите store
createApp(App)
    .use(createPinia())
    .mount('#app');