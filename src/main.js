import App from './App.vue'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { router } from '@/router/router.js'
import { vuetify } from '@/plugins/vuetify.js'
import { inject } from '@vercel/analytics'
import { injectSpeedInsights } from '@vercel/speed-insights'

const pinia = createPinia()

inject()
injectSpeedInsights()

createApp(App).use(router).use(pinia).use(vuetify).mount('#app')
