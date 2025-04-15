import { createRouter, createWebHistory } from 'vue-router'

import UserLogin from '../../frontend/Views/UserLogin.vue'
import UserRegister from '../../frontend/Views/UserRegister.vue'
import Home from '../../frontend/Views/Home.vue'
import Profile from '../components/UserProfile.vue'
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
      { path: '/profile', component: Profile },
     //{ path: 'adoptar', component: Adopt },       // /adoptar (protegido luego)
    ]
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router