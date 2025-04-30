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
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        // Redirigir según el rol
        const userData = res.data.user;
        if (userData.role === 'adoptante') {
          this.$router.push('/adopt');
        } else if (userData.role === 'refugio') {
          this.$router.push('/home/refugio');
        } else {
          // Rol no reconocido
          this.$router.push('/');
        }
        
      } catch (err) {
        this.error = err.response?.data?.message || 'Error al registrar';
        console.error(err);
      }
    }
  }
}
</script>

<style scoped>
div {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 1rem;
  box-sizing: border-box;
}

h2 {
  font-size: 1.8rem;
  color: #2c3e50;
  margin-bottom: 1rem;
  text-align: center;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 320px;
}

/* Campos de entrada y select */
input,
select {
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 10px;
  font-size: 1rem;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

input:focus,
select:focus {
  border-color: #42b883;
  outline: none;
  box-shadow: 0 0 0 3px rgba(66, 184, 131, 0.2);
}

/* Botón */
button {
  padding: 0.75rem;
  background-color: #42b883;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #369b6c;
}

/* Mensaje de error */
p {
  color: #e74c3c;
  margin-top: 0.5rem;
  font-size: 0.9rem;
  text-align: center;
}

@media (max-width: 480px) {
  h2 {
    font-size: 1.5rem;
  }

  input,
  select,
  button {
    font-size: 0.95rem;
    padding: 0.65rem;
  }

  form {
    max-width: 90%;
  }
}
</style>
