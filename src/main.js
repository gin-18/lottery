import './assets/main.css'

import App from './App.vue'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { router } from '@/router/router.js'
import { vuetify } from '@/plugins/vuetify.js'

const pinia = createPinia()

createApp(App).use(router).use(pinia).use(vuetify).mount('#app')
