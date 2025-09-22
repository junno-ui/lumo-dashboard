import { createApp } from 'vue'
import './style/style.css'
import App from './App.vue'
import ui from '@nuxt/ui/vue-plugin'
import router from './router/router'

const app = createApp(App)
app.use(ui)
app.use(router)
app.mount('#app')