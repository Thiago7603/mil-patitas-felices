<!-- src/components/UserProfile.vue -->
<template>
  <div class="profile-container">
    <h2>Mi Perfil</h2>

    <form @submit.prevent="updateProfile" class="profile-form">
      <div class="profile-image-section">
        <div class="image-preview" v-if="previewImage">
          <img :src="previewImage" alt="Perfil" class="profile-image" />
        </div>
        <div class="file-input-container">
          <label class="file-input-label">
            <span>{{ imageFile ? 'Cambiar imagen' : 'Seleccionar imagen' }}</span>
            <input type="file" @change="onImageSelected" accept="image/*" class="file-input" />
          </label>
          <div class="file-name" v-if="imageFile">{{ imageFile.name }}</div>
          <div class="file-name" v-else>No se ha seleccionado ningún archivo</div>
        </div>
      </div>

      <div class="form-grid">
        <div class="form-group">
          <label class="form-label">Nombre:</label>
          <input v-model="user.name" type="text" class="form-input" required />
        </div>

        <div class="form-group">
          <label class="form-label">Email:</label>
          <input v-model="user.email" type="email" class="form-input" required />
        </div>

        <div class="form-group">
          <label class="form-label">Dirección:</label>
          <input v-model="user.address" type="text" class="form-input" required />
        </div>

        <div class="form-group">
          <label class="form-label">Teléfono:</label>
          <input v-model="user.phone" type="text" class="form-input" required />
        </div>
      </div>

      <button type="submit" class="submit-button">Guardar Cambios</button>
    </form>

    <div class="recovery-section">
      <button @click="showRecovery = !showRecovery" class="recovery-toggle">
        ¿Olvidaste tu contraseña?
      </button>

      <div v-if="showRecovery" class="recovery-form">
        <h3>Recuperar contraseña</h3>

        <div v-if="!codeSent" class="recovery-step">
          <div class="form-group">
            <label class="form-label">Correo electrónico:</label>
            <input v-model="recoveryEmail" type="email" class="form-input" required />
          </div>
          <button @click="sendResetCode" class="recovery-button">Enviar código</button>
        </div>

        <div v-else class="recovery-step">
          <div class="form-group">
            <label class="form-label">Código de verificación:</label>
            <input v-model="resetCode" type="text" class="form-input" required />
          </div>

          <div class="form-group">
            <label class="form-label">Nueva contraseña:</label>
            <input v-model="newPassword" type="password" class="form-input" required />
          </div>

          <button @click="resetPassword" class="recovery-button">Restablecer contraseña</button>
        </div>
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
        this.previewImage = URL.createObjectURL(file)
      }
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
  max-width: 800px;
  width: 100%;
  background: white;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  padding: 2.5rem;
  margin: 0 auto;
}

.profile-container h2 {
  color: #027441;
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  text-align: center;
  position: relative;
  padding-bottom: 1rem;
}

.profile-container h2::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 3px;
  background-color: #42b883;
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.profile-image-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.image-preview {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
}

.profile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.file-input-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.file-input-label {
  background-color: #027441;
  color: white;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  text-align: center;
}

.file-input-label:hover {
  background-color: #026138;
}

.file-input {
  display: none;
}

.file-name {
  font-size: 0.9rem;
  color: #666;
  text-align: center;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 3rem;  
  row-gap: 2rem;  
}

.form-group {
  margin-bottom: 1rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 500;
  font-size: 0.95rem;
}

.form-input {
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-input:focus {
  border-color: #42b883;
  box-shadow: 0 0 0 3px rgba(66, 184, 131, 0.2);
  outline: none;
}

.submit-button {
  background-color: #027441;
  color: white;
  border: none;
  padding: 0.9rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
  font-size: 1rem;
  width: 100%;
}

.submit-button:hover {
  background-color: #026138;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(2, 116, 65, 0.3);
}

.recovery-section {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #eee;
}

.recovery-toggle {
  background: none;
  border: none;
  color: #027441;
  text-decoration: underline;
  cursor: pointer;
  font-size: 0.95rem;
  padding: 0;
  transition: color 0.2s;
}

.recovery-toggle:hover {
  color: #025a32;
}

.recovery-form {
  margin-top: 1.5rem;
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
}

.recovery-form h3 {
  color: #027441;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.recovery-step {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.recovery-button {
  background-color: #027441;
  color: white;
  border: none;
  padding: 0.7rem 1.2rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  align-self: flex-start;
}

.recovery-button:hover {
  background-color: #026138;
}

/* Responsive */
@media (max-width: 668px) {
  .form-grid {
    grid-template-columns: 0.9fr;
  }
  
  .profile-container {
    padding: 1.5rem;
  }
  
  .profile-image-section {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .profile-container {
    padding: 1rem;
  }
  
  .profile-container h2 {
    font-size: 1.5rem;
  }
}
</style>