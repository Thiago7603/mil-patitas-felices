<template>
  <header class="header">
    <div class="container">
      <h1 class="logo">Mil🐾Felices</h1>
      <button class="menu-toggle" @click="isMenuOpen = !isMenuOpen">
        <span></span>
        <span></span>
        <span></span>
      </button>
      <div class="nav-container" :class="{ 'is-open': isMenuOpen }">
        <nav class="nav">

          <template v-if="auth.user">
            <template v-if="auth.user.role === 'refugio'">
              <router-link :to="`/user/profile/${auth.user.id}`" class="nav-link">Perfil</router-link>
              <router-link to="/home/refugio" class="nav-link">Casa</router-link>
              <router-link to="/registrar-animal" class="nav-link">Publicar</router-link>
            </template>

            <template v-else-if="auth.user.role === 'adoptante'">
              <router-link :to="`/user/profile/${auth.user.id}`" class="nav-link">Perfil</router-link>
              <router-link to="/favorites" class="nav-link">Favoritos</router-link>
              <router-link to="/adopt" class="nav-link">Adoptar</router-link>
            </template>
          </template>
        </nav>

        <div class="auth-buttons">
          <template v-if="!auth.user">
            <router-link to="/" class="nav-link">Home</router-link>
            <router-link to="/user/login" class="btn-login">Login</router-link>
            <router-link to="/user/register" class="btn-register">Register</router-link>
          </template>
          <template v-else>
            <button @click="handleLogout" class="btn-login">Cerrar sesión</button>
          </template>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const isMenuOpen = ref(false);
const router = useRouter();
const auth = useAuthStore();

const handleLogout = () => {
  auth.logout();
  router.push('/');
};
</script>

<style scoped>
/* Todos los estilos anteriores se mantienen igual */
.header {
  background: rgb(255, 255, 255);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 80px;
  position: relative;
}

.logo {
  color: #42b883;
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
}

.menu-toggle {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  height: 21px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 10;
}

.menu-toggle span {
  width: 100%;
  height: 3px;
  background-color: #42b883;
  border-radius: 3px;
  transition: all 0.3s ease;
}

.nav-container {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: #2c3e50;
  text-decoration: none;
  font-weight: 800;
  font-size: 20px;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.nav-link:hover {
  color: #42b883;
  background-color: #f8f9fa;
}

.nav-link.router-link-active {
  color: #42b883;
  font-weight: 600;
}

.auth-buttons {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.btn-login {
  background: transparent;
  border: 2px solid #42b883;
  color: #42b883;
  padding: 0.5rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  transition: all 0.2s ease;
  cursor: pointer;
  white-space: nowrap;
}

.btn-login:hover {
  background: #42b883;
  color: white;
  transform: translateY(-1px);
}

.btn-register {
  background: #42b883;
  border: none;
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  transition: all 0.2s ease;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(66, 184, 131, 0.2);
  white-space: nowrap;
}

.btn-register:hover {
  background: #3aa876;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(66, 184, 131, 0.3);
}

@media (max-width: 768px) {
  .menu-toggle {
    display: flex;
  }

  .nav-container {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    background: white;
    padding: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    gap: 1rem;
  }

  .nav-container.is-open {
    display: flex;
  }

  .nav {
    flex-direction: column;
    width: 100%;
    gap: 0.5rem;
  }

  .nav-link {
    display: block;
    padding: 0.75rem 1rem;
  }

  .auth-buttons {
    flex-direction: column;
    width: 100%;
    gap: 0.5rem;
  }

  .btn-login,
  .btn-register {
    width: 100%;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .logo {
    font-size: 1.5rem;
  }

  .header .container {
    padding: 0.75rem;
  }
}
</style>