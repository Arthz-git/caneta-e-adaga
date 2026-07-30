import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
import './styles/theme.scss'
import './styles/base.scss'
import './styles/utilities.scss'
import './styles/naive-overrides.scss'
import { createPinia } from 'pinia'
import { useAuthStore } from './stores/useAuth'

const app = createApp(App)

app.use(createPinia())

useAuthStore().init()

app.use(router)

app.mount('#app')