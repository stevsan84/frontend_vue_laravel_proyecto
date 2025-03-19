import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
//import Inicio from './Inicio.vue'

createApp(App)
    .use(router)
    .mount('#app')
