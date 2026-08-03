import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router/router.ts'
import { createPinia } from 'pinia'

createApp(App).use(router).use(createPinia()).mount('#app')