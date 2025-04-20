<!-- src/components/UserProfile.vue -->
<template>
    <div class="profile-container">
      <h2>Mi Perfil</h2>
  
      <form @submit.prevent="updateProfile">
        <img :src="previewImage" alt="Perfil" v-if="previewImage" style="max-width: 200px; margin-top: 10px;" />
        <input type="file" @change="onImageSelected" />
  
        <div>
          <label>Nombre:</label>
          <input v-model="user.name" type="text" required />
        </div>
  
        <div>
          <label>Email:</label>
          <input v-model="user.email" type="email" required />
        </div>

          
        <div>
          <label>Dirección:</label>
          <input v-model="user.address" type="text" required />
        </div>

        <div>
          <label>Teléfono:</label>
          <input v-model="user.phone" type="text" required />
        </div>
  
        <button type="submit">Guardar Cambios</button>
      </form>
  
      <hr />
  
    <!-- Botón para mostrar formulario de recuperación -->
    <button @click="showRecovery = !showRecovery">
      ¿Olvidaste tu contraseña?
    </button>

    <!-- Formulario de recuperación -->
    <div v-if="showRecovery" style="margin-top: 20px;">
      <h3>Recuperar contraseña</h3>

      <div v-if="!codeSent">
        <label>Correo electrónico:</label>
        <input v-model="recoveryEmail" type="email" required />
        <button @click="sendResetCode">Enviar código</button>
      </div>

      <div v-else>
        <label>Código de verificación:</label>
        <input v-model="resetCode" type="text" required />

        <label>Nueva contraseña:</label>
        <input v-model="newPassword" type="password" required />

        <button @click="resetPassword">Restablecer contraseña</button>
      </div>
    </div>
  </div>
  </template>
  
  <script>
  import axios from 'axios'
  
  export default {
    data() {
    return {
      user: {
        id: '',
        name: '',
        email: '',
        phone: '',
        address: '',
        profile_image: ''
      },
      imageFile: null,
      previewImage: null,

      // Recuperar contraseña
      showRecovery: false,
      recoveryEmail: '',
      resetCode: '',
      newPassword: '',
      codeSent: false
    }
  },
    computed: {
      userId() {
        return this.$route.params.id
      }
    },
    mounted() {
      this.getProfile()
    },
    methods: {
    async getProfile() {
      const token = localStorage.getItem('jwt_token');
      try {
        const res = await axios.get(`http://localhost:4000/api/profile/${this.userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.user = res.data;
        if (res.data.profile_image) {
          this.previewImage = `http://localhost:4000/uploads/${res.data.profile_image}`;
        }
      } catch (err) {
        console.error('Error al cargar perfil:', err);
        alert('Debes iniciar sesión para ver tu perfil');
        this.$router.push('/login');
      }
    },
    onImageSelected(event) {
      const file = event.target.files[0]
      if (file) {
        this.imageFile = file
        this.previewImage = URL.createObjectURL(file) // muestra la vista previa
      }
    },
    handleImage(e) {
      this.imageFile = e.target.files[0]
    },
    async updateProfile() {
      const formData = new FormData()
      formData.append('name', this.user.name)
      formData.append('email', this.user.email)
      formData.append('address', this.user.address)
      formData.append('phone', this.user.phone)
      if (this.imageFile) {
        formData.append('image', this.imageFile)
      }

      try {
        const res = await axios.put(
          `http://localhost:4000/api/profile/${this.userId}`,
          formData
        )
        alert('Perfil actualizado correctamente')
        this.user = res.data.user
        this.imageFile = null
      } catch (err) {
        console.error('Error al actualizar perfil:', err)
        alert('Ocurrió un error al actualizar el perfil')
      }
    },
    async sendResetCode() {
      try {
        await axios.post('http://localhost:4000/api/forgot-password', {
          email: this.recoveryEmail
        })
        this.codeSent = true
        alert('Código enviado al correo electrónico')
      } catch (err) {
        console.error('Error al enviar código:', err)
        alert('Error al enviar el código')
      }
    },
    async resetPassword() {
      try {
        await axios.post('http://localhost:4000/api/reset-password', {
          email: this.recoveryEmail,
          code: this.resetCode,
          newPassword: this.newPassword
        })
        alert('Contraseña restablecida correctamente')
        this.showRecovery = false
        this.codeSent = false
        this.resetCode = ''
        this.newPassword = ''
      } catch (err) {
        console.error('Error al restablecer contraseña:', err)
        alert('Error al restablecer la contraseña')
      }
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
  