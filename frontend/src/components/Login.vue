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
import { setUser } from '../states/userState'
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

        // Guarda el token con nombre consistente
        localStorage.setItem('token', res.data.token); // Cambiado a 'token'
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setUser(res.data.user); //actualiza la variable global

        // Redirigir
        this.$router.push("/");
      } catch (err) {
        this.error = err.response?.data?.message || 'Correo o contraseña incorrectos';
        console.error('Error detallado:', err.response);
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

/* Campos de entrada */
input {
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 10px;
  font-size: 1rem;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

input:focus {
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
  button {
    font-size: 0.95rem;
    padding: 0.65rem;
  }

  form {
    max-width: 90%;
  }
}
</style>