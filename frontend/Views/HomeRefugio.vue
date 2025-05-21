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
              :class="{ 'active': filter === 'available' }"
              @click="filter = 'available'"
            >
              Disponibles para Adopción
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
                <span 
                  class="status-badge" 
                  :class="{ 'adopted': animal.adopted }" 
                >
                  {{ animal.adopted ? 'Adoptado' : 'Disponible' }}
                </span>
              </div>
            </div>
            <div class="card-body">
              <h3 class="animal-name">{{ animal.name }}</h3>
              <div class="animal-meta">
                <span class="animal-species">{{ formatSpecies(animal.species) }}</span>
                <span class="animal-age">{{ animal.age }} años</span>
              </div>
              <button class="view-details-btn">Ver detalles</button>
              <button
                class="edit-animal-btn"
                @click.stop="goToEditAnimal(animal.id, refugioId)"
              >
                Editar
              </button>
            </div>
          </div>
        </div>
  
        <div v-if="filteredAnimals.length === 0" class="empty-state">
          <i class="fas fa-paw"></i>
          <p>No hay animales disponibles con los filtros seleccionados</p>
        </div>
      </div>

      <!-- Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <button class="modal-close" @click="closeModal">×</button>
        <h2>{{ selectedAnimal.name }}</h2>
        <img :src="selectedAnimal.images[0]" :alt="`Foto de ${selectedAnimal.name}`" class="modal-image" />
        <p><strong>Edad:</strong> {{ selectedAnimal.age }} años</p>
        <p><strong>Especie:</strong> {{ formatSpecies(selectedAnimal.species) }}</p>
        <p><strong>Estado:</strong> {{ selectedAnimal.health_status || 'Disponible' }}</p>
        <p><strong>Descripción:</strong> {{ selectedAnimal.story || 'Sin descripción' }}</p>
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
        refugioId: ref(null),
        isLoading: ref(false),
        error: ref(null),
        showModal: false,
        selectedAnimal: null,
      };
    },
    computed: {
      filteredAnimals() {
        let list = this.animals;
        if (this.filter === 'avaible') {
          list = list.filter(a => !a.adopted);
        } else if (this.filter === 'dog') {
          list = list.filter(a => a.species?.toLowerCase() === 'perro'); 
        }else if (this.filter === 'cat') {
          list = list.filter(a => a.species?.toLowerCase() === 'gato');
        } else if (this.filter === 'others') {
          list = list.filter(a => !['perro', 'gato'].includes(a.species?.toLowerCase()));
        }
        if (this.filter !== 'all') { // Si no es "Todos", solo mostramos los no adoptados (salvo que sea 'available', que ya lo hace)
          list = list.filter(a => !a.adopted);
        }

        return list;
      }
  },
    methods: {
      formatSpecies(species) {
        return species.charAt(0).toUpperCase() + species.slice(1).toLowerCase();
      },
      openAnimalModal(animal) {
      this.selectedAnimal = animal;
      this.showModal = true;
      },
      closeModal() {
        this.showModal = false;
        this.selectedAnimal = null;
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
      },
      goToEditAnimal (animalId, refugioId) {
        this.$router.push(`/editar-animal/${animalId}/${refugioId}`);
      }
    },
    async mounted() {
      await this.fetchAnimals();
    }
  };
  </script>
  
  <style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

.refugio-home {
  font-family: 'Poppins', sans-serif;
  color: #333;
}

.hero-section {
  background: linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)),
    url('https://thumbs.dreamstime.com/b/muchos-animales-dom%C3%A9sticos-87694876.jpg') center/cover no-repeat;
  color: white;
  padding: 4rem 1rem;
  text-align: center;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.hero-text {
  font-size: 1.1rem;
  max-width: 700px;
  margin: 0 auto;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.filter-section {
  margin-bottom: 2rem;
  overflow-x: auto;
}

.filter-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: nowrap;
}

.filter-btn {
  padding: 0.7rem 1.2rem;
  border-radius: 30px;
  border: none;
  background-color: #e0e0e0;
  color: #333;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: 0.3s;
}

.filter-btn.active,
.filter-btn:hover {
  background-color: #2E7D32;
  color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.animal-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

.animal-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: 0.3s;
  cursor: pointer;
}

.animal-card:hover {
  transform: translateY(-5px);
}

.card-image-container {
  position: relative;
  height: 220px;
}

.animal-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.status-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #2E7D32;
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
}

.status-badge.adopted {
  background-color: #D32F2F;
}

.card-body {
  padding: 1rem;
  text-align: center;
}

.animal-name {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.animal-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 1rem;
}

.view-details-btn {
  background-color: #4CAF50;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: 0.3s;
}

.view-details-btn:hover {
  background-color: #388e3c;
}

.edit-animal-btn {
  background-color: #075aff;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  text-decoration: none;
  transition: background-color 0.3s;
  margin-left: 10px;
}

.edit-animal-btn:hover {
  background-color: #0004e0;
}

.empty-state {
  text-align: center;
  color: #777;
  margin-top: 3rem;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  max-width: 500px;
  width: 90%;
  position: relative;
  text-align: center;
  animation: fadeIn 0.3s ease-in-out;
}

.modal-image {
  width: 100%;
  max-height: 300px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 1rem;
}

.modal-close {
  position: absolute;
  top: 12px;
  right: 12px;
  font-size: 1.5rem;
  border: none;
  background: transparent;
  cursor: pointer;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
