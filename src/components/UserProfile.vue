<!-- src/components/UserProfile.vue -->
<template>
    <div class="profile-container">
      <h2>Mi Perfil</h2>
  
      <form @submit.prevent="updateProfile">
        <img :src="user.profileImage" alt="Perfil" width="100" height="100" />
        <input type="file" @change="onImageChange" />
  
        <div>
          <label>Nombre:</label>
          <input v-model="user.name" type="text" required />
        </div>
  
        <div>
          <label>Email:</label>
          <input v-model="user.email" type="email" required />
        </div>
  
        <button type="submit">Guardar Cambios</button>
      </form>
  
      <hr />
  
      <form @submit.prevent="changePassword">
        <h3>Cambiar Contraseña</h3>
        <div>
          <label>Contraseña Actual:</label>
          <input v-model="currentPassword" type="password" required />
        </div>
        <div>
          <label>Nueva Contraseña:</label>
          <input v-model="newPassword" type="password" required />
        </div>
        <button type="submit">Actualizar Contraseña</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        user: {
          name: '',
          email: '',
          profileImage: '' // URL de la imagen
        },
        currentPassword: '',
        newPassword: ''
      };
    },
    mounted() {
      this.fetchUser();
    },
    methods: {
      fetchUser() {
        // Simular una llamada al backend
        this.user = {
          name: 'Juan Pérez',
          email: 'juan@example.com',
          profileImage: '/img/default-profile.png'
        };
      },
      onImageChange(event) {
        const file = event.target.files[0];
        if (file) {
          this.user.profileImage = URL.createObjectURL(file); // Solo preview, no lo sube realmente
          // Para subir la imagen: usar FormData y enviarla por axios al backend
        }
      },
      updateProfile() {
        // Aquí harías una petición PUT al backend para guardar los cambios
        alert('Perfil actualizado (simulado)');
      },
      changePassword() {
        // Aquí harías una petición al backend para cambiar la contraseña
        alert('Contraseña actualizada (simulado)');
      }
    }
  };
  </script>
  
  <style scoped>
  .profile-container {
    max-width: 400px;
    margin: auto;
  }
  form {
    margin-bottom: 20px;
  }
  </style>
  