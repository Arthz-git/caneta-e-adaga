import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
import './styles/theme.css'
import './styles/base.css'
import { createPinia } from 'pinia'

const app = createApp(App)

app.use(router)

app.use(createPinia())

app.mount('#app')