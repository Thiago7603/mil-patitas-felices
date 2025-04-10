import { createRouter, createWebHistory } from 'vue-router'
import Login from '../components/Login.vue'
import Register from '../components/Register.vue'

const routes = [
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  // Puedes agregar más rutas aquí
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
