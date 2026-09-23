import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import { router } from './router'
import { persistIncidents } from './stores/incidents'

const pinia = createPinia()
pinia.use(persistIncidents)

createApp(App).use(pinia).use(router).mount('#app')
