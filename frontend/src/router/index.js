import { createRouter, createWebHistory } from 'vue-router'

import UserLogin from '../../Views/UserLogin.vue'
import UserRegister from '../../Views/UserRegister.vue'
import Home from '../../Views/Home.vue'
import AnimalRegister from '../../Views/AnimalRegister.vue'
import AnimalEdit from '../../Views/AnimalEdit.vue'
import HomeRefugio from '../../Views/HomeRefugio.vue'
import UserPerfil from '../../Views/UserPerfil.vue'
import Adopt from '../../Views/Adopt.vue'

// Layout
import MainLayout from '../layout/MainLayout.vue'

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', component: Home },              
      { path: '/user/login', component: UserLogin },
      { path: '/user/register', component: UserRegister },
      { path: '/registrar-animal/:id', component: AnimalRegister },
      { path: '/editar-animal/:id', component: AnimalEdit },
      { path: '/home/refugio/:id', component: HomeRefugio },
      { path: '/user/profile/:id', component: UserPerfil },
      { path: '/adopt', component: Adopt },    
    ]
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router