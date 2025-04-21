<template>
  <div class="home-container">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <div class="hero-icon">
          <i class="fas fa-paw"></i>
        </div>
        <h1 class="hero-title">Mil Patitas Felices</h1>
        <p class="hero-subtitle">En Mil Patitas Felices creemos que cada animal merece amor, cuidado y un hogar lleno de esperanza. Creamos un espacio donde los refugios pueden dar visibilidad a sus rescatados y donde adoptantes pueden descubrir a su nuevo mejor amigo. No es solo una adopción, es el comienzo de una historia llena de segundas oportunidades, nuevas aventuras y cariño incondicional.</p>
        <div class="hero-buttons">
          <router-link to="/user/login" class="btn btn-primary">Iniciar Sesión</router-link>
          <router-link to="/user/register" class="btn btn-secondary">Registrarse</router-link>
        </div>
      </div>
      <div class="hero-image">
        <img src="https://thumbs.dreamstime.com/b/grupo-de-animales-dom%C3%A9sticos-junto-en-frente-55938819.jpg" alt="Perro y gato juntos">
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section">
      <h2 class="section-title">¿Cómo funciona?</h2>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">
            <i class="fas fa-search"></i>
          </div>
          <h3>Encuentra</h3>
          <p>Descubre a tu compañero perfecto entre cientos de animales buscando un hogar</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <i class="fas fa-heart"></i>
          </div>
          <h3>Conecta</h3>
          <p>Conoce su historia y establece un vínculo con refugios y protectores</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <i class="fas fa-home"></i>
          </div>
          <h3>Adopta</h3>
          <p>Completa el proceso de adopción y dale un hogar lleno de amor</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'Home',
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.home-container {
  font-family: 'Poppins', sans-serif;
  line-height: 1.6;
  color: #333;
  overflow-x: hidden;
}

.hero-section {
  display: flex;
  min-height: 90vh;
  background: linear-gradient(135deg, rgba(6, 164, 58, 0.8) 0%, rgba(208, 208, 208, 0.759) 100%);
  position: relative;
}

.hero-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2rem 5rem;
  z-index: 2;
  text-align: center;
}

.hero-icon {
  font-size: 4rem;
  color: #027441;
  margin-bottom: 1.5rem;
  margin: 0 auto;
}

.hero-image {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.hero-image::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.hero-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  color: #ffffff;
  line-height: 1.2;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
}

.hero-subtitle {
  font-size: 1.0rem;
  margin-bottom: 2.5rem;
  color: #e7e7e7;
  max-width: 600px;
  margin: 0 auto;
}

.hero-buttons {
  display: flex;
  gap: 1.5rem;
  margin-top: 1rem;
  justify-content: center;
}

.btn {
  padding: 0.9rem 2rem;
  border-radius: 50px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  display: inline-block;
  font-size: 1.1rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.btn-primary {
  background-color: #027441;
  color: #ffffff;
  border: 2px solid #027441;
}

.btn-primary:hover {
  background-color: transparent;
  color: #027441;
  transform: translateY(-3px);
}

.btn-secondary {
  background-color: #027441;
  color: #ffffff;
  border: 2px solid #027441;
}

.btn-secondary:hover {
  background-color: transparent;
  color: #027441;
  transform: translateY(-3px);
}

.features-section {
  padding: 6rem 2rem;
  background-color: #ffffff;
  text-align: center;
  position: relative;
}

.section-title {
  font-size: 2.8rem;
  margin-bottom: 4rem;
  color: #333;
  position: relative;
  display: inline-block;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 5px;
  background-color: #42b883;
  border-radius: 3px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 3rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.feature-card {
  padding: 2.5rem 2rem;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  background-color: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

.feature-icon {
  font-size: 3rem;
  color: #42b883;
  margin-bottom: 1.5rem;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 125, 0, 0.1);
  border-radius: 50%;
  margin: 0 auto 1.5rem;
}

.feature-card h3 {
  font-size: 1.6rem;
  margin-bottom: 1.2rem;
  color: #333;
}

.feature-card p {
  color: #6c757d;
  font-size: 1.1rem;
  line-height: 1.7;
}

@media (max-width: 1200px) {
  .hero-content {
    padding: 2rem 3rem;
  }
}

@media (max-width: 992px) {
  .hero-section {
    flex-direction: column;
    min-height: auto;
  }

  .hero-content {
    padding: 4rem 2rem;
    order: 2;
    text-align: center;
    align-items: center;
  }

  .hero-image {
    order: 1;
    height: 400px;
  }

  .hero-title {
    font-size: 2.8rem;
  }

  .hero-buttons {
    justify-content: center;
  }

  .features-grid {
    grid-template-columns: 1fr;
    max-width: 600px;
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.2rem;
  }

  .hero-subtitle {
    font-size: 1.2rem;
  }

  .section-title {
    font-size: 2.2rem;
  }

  .btn {
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
  }

  .hero-buttons {
    flex-direction: column;
    gap: 1rem;
    width: 100%;
  }

  .btn {
    width: 100%;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }

  .section-title {
    font-size: 1.8rem;
  }

  .feature-card {
    padding: 2rem 1.5rem;
  }
}
</style>
