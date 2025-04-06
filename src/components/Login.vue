<template>
    <div class="login-container">
      <h2>{{ isRegistering ? 'Registrarse' : 'Iniciar sesión' }}</h2>
      <form @submit.prevent="handleAuth">
        <input v-model="email" type="email" placeholder="Correo" required />
        <input v-model="password" type="password" placeholder="Contraseña" required />
        <button type="submit">{{ isRegistering ? 'Registrar' : 'Entrar' }}</button>
      </form>
      <p @click="isRegistering = !isRegistering" style="cursor: pointer; color: blue;">
        {{ isRegistering ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate' }}
      </p>
      <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { auth } from '../firebase';
  import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
  } from 'firebase/auth';
  
  const email = ref('');
  const password = ref('');
  const isRegistering = ref(false);
  const errorMessage = ref('');
  
  const handleAuth = async () => {
    errorMessage.value = '';
    try {
      if (isRegistering.value) {
        await createUserWithEmailAndPassword(auth, email.value, password.value);
        alert('Registro exitoso 🎉');
      } else {
        await signInWithEmailAndPassword(auth, email.value, password.value);
        alert('Inicio de sesión exitoso ✅');
      }
    } catch (err) {
      errorMessage.value = err.message;
    }
  };
  </script>
  
  <style scoped>
  .login-container {
    max-width: 400px;
    margin: 50px auto;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 0 10px #ccc;
  }
  input {
    display: block;
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
  }
  button {
    width: 100%;
    padding: 10px;
    background-color: #4caf50;
    color: white;
    border: none;
    cursor: pointer;
  }
  button:hover {
    background-color: #45a049;
  }
  </style>
  