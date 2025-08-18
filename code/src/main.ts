import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css' // Tailwind styles

createApp(App)
  .use(router)
  .mount('#app')
