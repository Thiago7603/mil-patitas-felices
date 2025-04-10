import { createRouter, createWebHistory } from 'vue-router'
import Login from '../components/Login.vue'
import Register from '../components/Register.vue'
import UserLogin from '../../frontend/Views/UserLogin.vue'
import UserRegister from '../../frontend/Views/UserRegister.vue'

const routes = [
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/user/login', component: UserLogin },
  { path: '/user/register', component: UserRegister }
  // Puedes agregar más rutas aquí
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
