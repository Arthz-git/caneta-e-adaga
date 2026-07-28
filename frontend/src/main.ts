import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
import './styles/theme.scss'
import './styles/base.scss'
import './styles/utilities.scss'
import { createPinia } from 'pinia'

const app = createApp(App)

app.use(router)

app.use(createPinia())

app.mount('#app')