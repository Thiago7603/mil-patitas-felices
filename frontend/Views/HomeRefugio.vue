<template>
    <div class="refugio-home">
      <section class="hero-section">
        <div class="hero-content">
          <h1 class="hero-title">Tu Amor Cambia Vidas</h1>
          <p class="hero-text">
            Cada vida que salvas, cada historia que compartes, y cada huella que dejas en este mundo, 
            transforma la tristeza en amor. Gracias por abrir tu corazón y darle voz a quienes solo 
            saben hablar con la mirada.
          </p>
        </div>
      </section>
  
      <div class="container">
        <div class="filter-section">
          <div class="filter-buttons">
            <button 
              class="filter-btn" 
              :class="{ 'active': filter === 'all' }" 
              @click="filter = 'all'"
            >
              Todos
            </button>
            <button 
              class="filter-btn" 
              :class="{ 'active': filter === 'dog' }" 
              @click="filter = 'dog'"
            >
              <i class="fas fa-dog"></i> Perros
            </button>
            <button 
              class="filter-btn" 
              :class="{ 'active': filter === 'cat' }" 
              @click="filter = 'cat'"
            >
              <i class="fas fa-cat"></i> Gatos
            </button>
            <button 
              class="filter-btn" 
              :class="{ 'active': filter === 'others' }" 
              @click="filter = 'others'"
            >
              otros
            </button>
          </div>
        </div>
  
        <div class="animal-gallery">
          <div 
            v-for="animal in filteredAnimals" 
            :key="animal.id" 
            class="animal-card"
            @click="openAnimalModal(animal)"
          >
            <div class="card-image-container">
              <img 
                :src="animal.images[0]" 
                :alt="`Foto de ${animal.name}`" 
                class="animal-image"
                loading="lazy"
              />
              <div class="card-overlay">
                <span class="status-badge">{{ animal.status || 'Disponible' }}</span>
              </div>
            </div>
            <div class="card-body">
              <h3 class="animal-name">{{ animal.name }}</h3>
              <div class="animal-meta">
                <span class="animal-species">{{ formatSpecies(animal.species) }}</span>
                <span class="animal-age">{{ animal.age }} años</span>
              </div>
              <button class="view-details-btn">Ver detalles</button>
            </div>
          </div>
        </div>
  
        <div v-if="filteredAnimals.length === 0" class="empty-state">
          <i class="fas fa-paw"></i>
          <p>No hay animales disponibles con los filtros seleccionados</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';

  export default {
    data() {
      return {
        filter: 'all',
        animals: ref([]),
        refugioId: null,
        isLoading: ref(false),
        error: ref(null)
      };
    },
    computed: {
      filteredAnimals() {
        let list = this.animals;
        if (this.filter === 'dog') {
          list = list.filter(a => a.species?.toLowerCase() === 'perro');
        } else if (this.filter === 'cat') {
          list = list.filter(a => a.species?.toLowerCase() === 'gato');
        } else if (this.filter === 'others') {
          list = list.filter(a => !['perro', 'gato'].includes(a.species?.toLowerCase()));
        }
        return list;
      }
  },
    methods: {
      formatSpecies(species) {
        return species.charAt(0).toUpperCase() + species.slice(1).toLowerCase();
      },
      openAnimalModal(animal) {
        // Implementar lógica para abrir modal con detalles del animal
        console.log('Mostrar detalles de:', animal);
      },
      async fetchAnimals() {
        this.isLoading = true;
        try {
          // Obtén el ID de la URL
          const refugioId = this.$route.params.id;
          this.refugioId = refugioId;
          const token = localStorage.getItem('token'); // Obtener el token
          const response = await fetch(`http://localhost:4000/api/animals/refugio/${refugioId}`, {
            headers: {
              'Authorization': `Bearer ${token}`, // Envía el token
              'Accept': 'application/json'
            }
          });

          console.log('Token usado:', localStorage.getItem('token'));
          console.log('ID de usuario:', refugioId);

          const contentType = response.headers.get('content-type');
    
          if (!contentType || !contentType.includes('application/json')) {
            const textResponse = await response.text();
            throw new Error(`Respuesta inesperada: ${textResponse.substring(0, 100)}...`);
          }

          const data = await response.json();
          console.log('array', data);

          if (!Array.isArray(data)) {
            throw new Error('La respuesta no es un array válido');
          }

          this.animals = data.map(animal => ({
            ...animal,
            images: animal.images.map(img => `http://localhost:4000/uploads/${img}`)
          }));

        } catch (error) {
          console.error("Error:", error);
          this.error = error.message;
        } finally {
          this.isLoading = false;
        }
      }
    },
    async mounted() {
      await this.fetchAnimals();
    }
  };
  </script>
  
  <style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
  @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');
  
  :root {
    --primary-color: #2E7D32;
    --primary-light: #4CAF50;
    --primary-dark: #1B5E20;
    --secondary-color: #FF9800;
    --text-color: #333;
    --text-light: #666;
    --bg-light: #f9f9f9;
    --white: #ffffff;
    --gray-light: #e0e0e0;
    --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.1);
    --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.15);
    --transition: all 0.3s ease;
  }
  
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  .refugio-home {
    font-family: 'Poppins', sans-serif;
    color: var(--text-color);
    line-height: 1.6;
  }
  
  .hero-section {
    background: linear-gradient(rgba(46, 125, 50, 0.427), rgba(46, 125, 50, 0.619)), 
                url('https://thumbs.dreamstime.com/b/muchos-animales-dom%C3%A9sticos-87694876.jpg');
    background-size: cover;
    background-position: center;
    padding: 5rem 1rem;
    text-align: center;
    color: #ffffff;
    margin-bottom: 2rem;
  }
  
  .hero-content {
    max-width: 800px;
    margin: 0 auto;
  }
  
  .hero-title {
    font-size: 2.5rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3);
  }
  
  .hero-text {
    font-size: 1.1rem;
    font-weight: 300;
    margin-bottom: 1.5rem;
    opacity: 0.9;
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }
  
  .filter-section {
    margin-bottom: 2.5rem;
  }
  
  .filter-buttons {
    display: flex;
    gap: 1rem;
    padding-bottom: 0.5rem;
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
    white-space: nowrap;
  }
  
  .filter-buttons::-webkit-scrollbar {
    display: none;
  }
  
  .filter-btn {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 50px;
    background-color: var(--gray-light);
    color: var(--text-color);
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition);
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    flex-shrink: 0;
  }
  
  .filter-btn:hover {
    background-color: #d0d0d0;
    transform: translateY(-2px);
  }
  
  .filter-btn.active {
    background-color: var(--primary-color);
    color: var(--white);
    box-shadow: var(--shadow-sm);
  }
  
  .animal-gallery {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
    margin-bottom: 3rem;
  }
  
  .animal-card {
    background: var(--white);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: var(--shadow-sm);
    transition: var(--transition);
    cursor: pointer;
  }
  
  .animal-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-md);
  }
  
  .card-image-container {
    position: relative;
    height: 220px;
    overflow: hidden;
  }
  
  .animal-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  
  .animal-card:hover .animal-image {
    transform: scale(1.05);
  }
  
  .card-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    padding: 1rem;
    display: flex;
    justify-content: flex-end;
  }
  
  .status-badge {
    background-color: var(--primary-light);
    color: var(--white);
    font-size: 0.75rem;
    font-weight: 500;
    padding: 0.25rem 0.75rem;
    border-radius: 50px;
  }
  
  .card-body {
    padding: 1.25rem;
    text-align: left;
  }
  
  .animal-name {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: var(--text-color);
  }
  
  .animal-meta {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    font-size: 0.9rem;
    color: var(--text-light);
  }
  
  .view-details-btn {
    width: 100%;
    padding: 0.5rem;
    background-color: transparent;
    border: 1px solid var(--primary-color);
    color: var(--primary-color);
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition);
  }
  
  .view-details-btn:hover {
    background-color: var(--primary-color);
    color: var(--white);
  }
  
  .empty-state {
    text-align: center;
    padding: 3rem;
    color: var(--text-light);
  }
  
  .empty-state i {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: var(--gray-light);
  }
  
  @media (max-width: 768px) {
    .hero-title {
      font-size: 2rem;
    }
    
    .hero-text {
      font-size: 1rem;
    }
    
    .animal-gallery {
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    }
  }
  
  @media (max-width: 480px) {
    .hero-section {
      padding: 3rem 1rem;
    }
    
    .hero-title {
      font-size: 1.75rem;
    }
  }
  </style>