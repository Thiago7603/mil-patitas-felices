<template>
    <div class="app-container">
      <!-- Hero Section -->
      <div class="hero-section">
        <div class="hero-overlay"></div>
        <div class="hero-content">
          <div class="logo-container">
            <span class="logo-icon">🐾</span>
            <h1 class="logo-text">MilPatitasFelices</h1>
          </div>
          
          <h2 class="hero-title">Encuentra a tu <span>compañero perfecto</span></h2>
          <p class="hero-description">Cada adopción cambia dos vidas: la de una mascota que encuentra un hogar y la de una persona que gana un amigo fiel.</p>
          
          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon">🏠</div>
              <h3>Hogares Seguros</h3>
              <p>Todos nuestros animales son evaluados y necesitan un lugar amoroso</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">❤️</div>
              <h3>Adopción Responsable</h3>
              <p>Proceso cuidadoso para garantizar el mejor match</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Register Section -->
      <div class="register-section">
        <div class="register-container">
          <div class="register-header">
            <h2>Únete a nuestra comunidad</h2>
            <p>Crea una cuenta para comenzar el proceso de adopción o para ayudar a mascotas necesitadas</p>
          </div>
          
          <Register />
          
          <div class="register-footer">
            <p>¿Ya tienes una cuenta? <router-link to="/user/login"><strong>Inicia sesión</strong></router-link> aquí</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import Register from '../src/components/Register.vue'
  
  export default {
    name: 'UserRegister',
    components: {
      Register
    }
  }
  </script>
  
  <style scoped>
  .app-container {
  display: flex;
  min-height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  overflow: hidden;
  }

  /* HERO */
  .hero-section {
    flex: 1;
    background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),
      url('../../src/assets/images/pets-hero.jpg') center/cover no-repeat;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    position: relative;
    overflow-y: auto;
    padding: 2rem;
  }

  .hero-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(6, 164, 58, 0.8) 0%, rgba(255, 255, 255, 0.759) 100%);
    z-index: 0;
  }

  .hero-content {
    position: relative;
    z-index: 1;
    max-width: 600px;
    width: 100%;
    padding: 1rem;
  }

  .logo-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    margin-bottom: 2rem;
  }

  .logo-icon {
    font-size: 2rem;
  }

  .logo-text {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0;
  }

  .hero-title {
    font-size: clamp(1.8rem, 4vw, 2.5rem);
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: 1rem;
  }

  .hero-title span {
    color: #FFD166;
  }

  .hero-description {
    font-size: clamp(1rem, 1.2vw, 1.1rem);
    line-height: 1.6;
    opacity: 0.9;
    margin-bottom: 2rem;
  }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1.2rem;
    margin-top: 1.5rem;
  }

  .feature-card {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 12px;
    padding: 1.5rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .feature-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }

  .feature-icon {
    font-size: 1.8rem;
    margin-bottom: 0.8rem;
  }

  .feature-card h3 {
    font-size: 1.1rem;
    margin-bottom: 0.4rem;
  }

  .feature-card p {
    font-size: 0.85rem;
    opacity: 0.8;
    line-height: 1.5;
  }

  /* REGISTER */
  .register-section {
    flex: 0 0 450px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #FFFFFF;
    overflow-y: auto;
    box-shadow: -5px 0 15px rgba(0, 0, 0, 0.05);
    padding: 2rem;
  }

  .register-container {
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    padding: 2.5rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;
    max-width: 400px;
  }

  .register-header {
    text-align: center;
  }

  .register-header h2 {
    font-size: 1.8rem;
    font-weight: 700;
    color: #2c3e50;
    margin-bottom: 0.5rem;
  }

  .register-header p {
    font-size: 0.95rem;
    color: #7f8c8d;
  }

  .register-footer {
    text-align: center;
    font-size: 0.9rem;
    color: #34495e;
  }

  .register-footer a {
    text-decoration: none;
    color: inherit;
  }

  .register-footer strong {
    color: #42b883;
    font-weight: 600;
    cursor: pointer;
    transition: color 0.3s ease;
    position: relative;
  }

  .register-footer strong:hover {
    color: #42b883;
  }

  .register-footer strong::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 2px;
    background-color: #50a16f;
    transition: width 0.3s ease;
  }

  .register-footer strong:hover::after {
    width: 100%;
  }

  /* RESPONSIVE */
  @media (max-width: 992px) {
    .app-container {
      flex-direction: column;
      overflow-y: auto;
    }

    .hero-section {
      min-height: auto;
      padding: 3rem 1.5rem;
    }

    .register-section {
      flex: 1;
      padding: 3rem 1.5rem;
    }

    .features-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 480px) {
    .register-container {
      padding: 2rem 1.25rem;
    }

    .hero-title {
      font-size: 1.7rem;
    }

    .register-header h2 {
      font-size: 1.6rem;
    }

    .feature-card {
      padding: 1.2rem;
    }

    .logo-container {
      flex-direction: column;
      gap: 0.5rem;
    }
  }

  </style>