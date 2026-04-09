import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { createAdminRouter } from './router'
import './assets/main.css'

const pinia = createPinia()
const router = createAdminRouter({ pinia })

createApp(App).use(pinia).use(router).mount('#app')
