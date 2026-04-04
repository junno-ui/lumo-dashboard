import { createApp } from 'vue'
import './shared/styles/style.css'
import App from './app/App.vue'
import ui from '@nuxt/ui/vue-plugin'
import router from './app/router'

const app = createApp(App)
app.use(ui)
app.use(router)
app.mount('#app')