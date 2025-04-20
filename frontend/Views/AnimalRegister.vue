<template>
    <div class="register-view">
      <h1>Registrar Animal en Adopción</h1>
      <RegisterAnimal />
    </div>
  </template>
  
  <script>
  import RegisterAnimal from '@/components/RegisterAnimal.vue'; // Mantén solo esta importación
  
  export default {
    name: 'AnimalRegisterView',
    components: {
      RegisterAnimal
    }
  };
  </script>
  
  <style scoped>
  .register-view {
    padding: 30px;
    text-align: center;
  }
  </style>
  