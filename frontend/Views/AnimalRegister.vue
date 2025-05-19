<template>
  <div class="animal-register-view">
    <div class="register-container">
      <div class="register-header">
        <h1><i class="fas fa-paw"></i> Registrar Animal en Adopción</h1>
        <p class="subtitle">Comparte la historia del peludito que busca un hogar</p>
      </div>
      
      <div class="register-form-container">
        <RegisterAnimal @animal-registered="goToHome" />
      </div>
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
.animal-register-view {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  padding: 40px 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4f0f5 100%);
}

.register-container {
  width: 100%;
  max-width: 800px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.register-header {
  background-color: #027441;
  color: white;
  padding: 30px;
  text-align: center;
}

.register-header h1 {
  margin: 0;
  font-size: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.register-header .subtitle {
  margin: 10px 0 0;
  font-size: 16px;
  opacity: 0.9;
}

.register-form-container {
  padding: 30px;
}

@media (max-width: 768px) {
  .animal-register-view {
    padding: 20px 10px;
  }
  
  .register-header {
    padding: 20px;
  }
  
  .register-header h1 {
    font-size: 24px;
  }
  
  .register-form-container {
    padding: 20px;
  }
}
</style>