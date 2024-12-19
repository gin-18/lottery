import '@/assets/css/main.css'

import App from './App.vue'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { router } from '@/router/router.js'
const pinia = createPinia()

router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  next()
})

createApp(App).use(router).use(pinia).mount('#app')
