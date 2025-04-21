import { createRouter, createWebHistory } from 'vue-router'

import UserLogin from '../../Views/UserLogin.vue'
import UserRegister from '../../Views/UserRegister.vue'
import Home from '../../Views/Home.vue'
import Profile from '../components/UserProfile.vue'
import AnimalRegister from '../../Views/AnimalRegister.vue'
import AnimalEdit from '../../Views/AnimalEdit.vue'
import HomeRefugio from '../../Views/HomeRefugio.vue'
//import Adopt from '../../frontend/Views/Adopt.vue'

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
      { path: '/user/profile/:id', component: Profile },
      { path: '/registrar-animal', component: AnimalRegister },
      { path: '/editar-animal/:id', component: AnimalEdit },
      { path: '/home/refugio', component: HomeRefugio },
     //{ path: 'adoptar', component: Adopt },       // /adoptar (protegido luego)
    ]
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router