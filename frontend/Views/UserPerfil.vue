<template>
  <div class="profile-view">
    <!-- Header similar al Home -->
    <section class="profile-hero">
      <div class="profile-hero-content">
        <h1 class="profile-hero-title">Mi Perfil</h1>
        <p class="profile-hero-subtitle">Administra tu información personal y preferencias</p>
      </div>
    </section>

    <!-- Contenedor principal -->
    <div class="profile-main-container">
      <!-- Componente UserProfile -->
      <UserProfile />
    </div>
  </div>
</template>

<script>
import UserProfile from '../src/components/UserProfile.vue';

export default {
  name: 'UserProfileView',
  components: {
    UserProfile
  }
};
</script>

<style scoped>
.profile-view {
  font-family: 'Poppins', sans-serif;
  color: #333;
  min-height: 100vh;
  background-color: #f8f9fa;
}

.profile-hero {
  background: linear-gradient(135deg, rgba(6, 164, 58, 0.8) 0%, rgba(208, 208, 208, 0.759) 100%);
  padding: 4rem 2rem;
  text-align: center;
  color: white;
  position: relative;
  overflow: hidden;
}

.profile-hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('https://thumbs.dreamstime.com/b/grupo-de-animales-dom%C3%A9sticos-junto-en-frente-55938819.jpg') center/cover no-repeat;
  opacity: 0.2;
  z-index: 0;
}

.profile-hero-content {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
}

.profile-hero-title {
  font-size: 2.8rem;
  font-weight: 800;
  margin-bottom: 1rem;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
}

.profile-hero-subtitle {
  font-size: 1.2rem;
  max-width: 600px;
  margin: 0 auto;
  opacity: 0.9;
}

.profile-main-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  justify-content: center;
}

@media (max-width: 768px) {
  .profile-hero {
    padding: 3rem 1rem;
  }
  
  .profile-hero-title {
    font-size: 2.2rem;
  }
  
  .profile-hero-subtitle {
    font-size: 1rem;
  }
  
  .profile-main-container {
    padding: 1rem;
  }
}
</style>