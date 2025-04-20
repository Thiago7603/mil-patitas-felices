<template>
    <div>
      <h2>Registro</h2>
      <form @submit.prevent="handleRegister">
        <input v-model="name" placeholder="Nombre" required />
        <input v-model="email" type="email" placeholder="Correo" required />
        <input v-model="password" type="password" placeholder="Contraseña" required />
        <input v-model="address" placeholder="Dirección" />
        <input v-model="phone" placeholder="Teléfono" />
        <select v-model="role" required>
          <option value="adoptante">Adoptante</option>
          <option value="refugio">Refugio</option>
        </select>
        <button type="submit">Registrarse</button>
      </form>
      <p v-if="error">{{ error }}</p>
    </div>
  </template>
  
  <script>
  import axios from 'axios'
  
  export default {
    data() {
      return {
        name: '',
        email: '',
        password: '',
        address: '',
        phone: '',
        role: 'adoptante',
        error: ''
      }
    },
    methods: {
      async handleRegister() {
        try {
          const res = await axios.post('http://localhost:4000/api/register', {
            name: this.name,
            email: this.email,
            password: this.password,
            address: this.address,
            phone: this.phone,
            role: this.role
          });
          
          console.log('✅ Registro exitoso', res.data);
          
          // Guardar el token en localStorage
          localStorage.setItem('token', res.data.token);
          
          // Guardar datos del usuario (opcional)
          localStorage.setItem('user', JSON.stringify(res.data.user));
          
          // Redirigir al dashboard o página principal
          this.$router.push('/');
          
        } catch (err) {
          this.error = err.response?.data?.message || 'Error al registrar';
          console.error(err);
        }
      }
    }
  }
  </script>
  