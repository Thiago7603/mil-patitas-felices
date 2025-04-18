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
  
      <form @submit.prevent="changePassword">
        <h3>Cambiar Contraseña</h3>
        <div>
          <label>Nueva Contraseña:</label>
          <input v-model="newPassword" type="password" required />
        </div>
        <button type="submit">Actualizar Contraseña</button>
      </form>
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
      previewImage: null
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
      try {
        const res = await axios.get(`http://localhost:4000/api/profile/${this.userId}`)
        this.user = res.data
        if (res.data.profile_image) {
          this.previewImage = `http://localhost:4000/uploads/${res.data.profile_image}`
        }
      } catch (err) {
        console.error('Error al cargar perfil:', err)
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
  