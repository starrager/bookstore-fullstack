import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router/router.ts'
import { createPinia } from 'pinia'

import Toast from '@erag/vue-toastification'
import '@erag/vue-toastification/dist/style.css'

createApp(App).use(router).use(createPinia()).use(Toast,{
    position:'bottom-right',
    timeout:3000
}).mount('#app')