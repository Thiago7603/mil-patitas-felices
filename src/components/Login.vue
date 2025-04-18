<!-- src/components/Login.vue -->
<template>
    <div>
      <h2>Iniciar Sesión</h2>
      <form @submit.prevent="handleLogin">
        <input type="email" v-model="email" placeholder="Correo" required />
        <input type="password" v-model="password" placeholder="Contraseña" required />
        <button type="submit">Entrar</button>
      </form>
      <p v-if="error">{{ error }}</p>
    </div>
  </template>
  
  <script>
  import axios from 'axios'
  
  export default {
    data() {
      return {
        email: '',
        password: '',
        error: ''
      }
    },
    methods: {
      async handleLogin() {
        try {
          const res = await axios.post('http://localhost:4000/api/login', {
            email: this.email,
            password: this.password
          });
          console.log('Login exitoso', res.data);
          const user = res.data.user
          // Aquí puedes redirigir o guardar token si fuera necesario

          // Redirigir al perfil
          this.$router.push(`/user/profile/${user.id}`)
        } catch (err) {
          this.error = 'Correo o contraseña incorrectos';
          console.error(err);
        }
      }
    }
  }
  </script>
  