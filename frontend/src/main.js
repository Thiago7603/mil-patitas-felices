import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { library } from '@fortawesome/fontawesome-svg-core';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const app = createApp(App)
const pinia = createPinia()

library.add(faHeart);

app.use(pinia)
app.use(router)

import { useAuthStore } from './stores/authStore'
useAuthStore().loadUser()

app.component('font-awesome-icon', FontAwesomeIcon);
app.mount('#app')
