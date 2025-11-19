import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

try {
  const app = createApp(App)

  app.use(createPinia())
  app.use(router)

  app.mount('#app')
} catch (error) {
  console.error('Failed to mount Vue app:', error)
  document.getElementById('app')!.innerHTML = `
    <div style="padding: 20px; color: red;">
      <h1>Error loading application</h1>
      <p>${error instanceof Error ? error.message : String(error)}</p>
      <p>Check the browser console for more details.</p>
    </div>
  `
}
