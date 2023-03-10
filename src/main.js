import { createApp } from 'vue'

import { createWebHistory } from 'vue-router'

import createRouter from './pages/routes.js'

import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'

// // Import our custom CSS
// import './styles/main.scss'

// // Import all of Bootstrap's JS
// import * as bootstrap from 'bootstrap'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'

const store = createPinia()
const router = createRouter(createWebHistory())

createApp(App).use(router).use(store).mount('#app')
