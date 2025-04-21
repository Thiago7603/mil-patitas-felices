<template>
  <div class="animal-register-container">
    <div class="register-card">
      <h1>🐾 Registrar Animal en Adopción</h1>
      <p class="subtitle">Comparte la historia del peludito que busca un hogar</p>
      <RegisterAnimal @animal-registered="goToHome" />
    </div>
  </div>
</template>

<script>
import RegisterAnimal from '@/components/RegisterAnimal.vue';

export default {
  name: 'AnimalRegisterView',
  components: {
    RegisterAnimal
  },
  methods: {
    goToHome() {
      this.$router.push('/refugio/home');
    }
  }
};
</script>

<style scoped>
.animal-register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
  background: #f5f5f5;
  min-height: 100vh;
  box-sizing: border-box;
}

.register-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  max-width: 720px;
  width: 100%;
  padding: 40px 30px;
  text-align: center;
}

.register-card h1 {
  margin-bottom: 10px;
  color: #333;
  font-size: 28px;
}

.subtitle {
  color: #666;
  font-size: 16px;
  margin-bottom: 30px;
}
</style>


