<template>
    <div class="favorites">
      <h2>Mis Favoritos</h2>
      <div v-if="isLoading" class="loader-container">
        <div class="loader"></div>
      </div>
      <div v-else-if="favorites.length">
        <div class="animal-cards">
          <div v-for="animal in favorites" :key="animal.id" @click="openAnimalDetail(animal)">
            <div class="card-image-container">
              <img v-if="animal.images && animal.images.length > 0" :src="animal.images[0]" :alt="animal.name">
              <img v-else src="https://via.placeholder.com/300x200?text=No+Image" :alt="animal.name">
            </div>
            <div class="card-content">
              <h3>{{ animal.name }}</h3>
              <p><span class="label">Especie:</span> {{ animal.species }}</p>
              <p><span class="label">Edad:</span> {{ animal.age }} años</p>
              <p><span class="label">Tamaño:</span> {{ animal.size }}</p>
              <p><span class="label">Ubicación:</span> {{ animal.location }}</p>
            </div>
          </div>
        </div>
      </div>
      <p v-else>No tienes favoritos aún.</p>

          <!-- Modal de detalles del animal -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <button class="close-modal" @click="closeModal">X</button>
        <h2>{{ selectedAnimal.name }}</h2>
        <div class="modal-image-container">
          <img v-if="selectedAnimal.images && selectedAnimal.images.length > 0" 
               :src="selectedAnimal.images[0]" 
               alt="Animal" class="animal-image">
          <img v-else src="https://via.placeholder.com/600x400?text=No+Image" alt="Animal" class="animal-image">
        </div>
        <div class="modal-details">
          <p><strong>Especie:</strong> {{ selectedAnimal.species }}</p>
          <p><strong>Edad:</strong> {{ selectedAnimal.age }} años</p>
          <p><strong>Tamaño:</strong> {{ selectedAnimal.size }}</p>
          <p><strong>Ubicación:</strong> {{ selectedAnimal.location }}</p>
          <p><strong>Historia:</strong> {{ selectedAnimal.story }}</p>
          <p><strong>Requisitos de adopción:</strong> {{ selectedAnimal.adoption_requirements }}</p>

           <!-- icono para marcar animal como favorito -->
          <font-awesome-icon
            :icon="['fas', 'heart']"
            class="heart-icon"
            :style="{ color: heartColor }"
            @click.stop="toggleFavorite(selectedAnimal.id)"
          />
        </div>
      </div>
    </div>
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref, computed } from 'vue'
  import { useRoute } from 'vue-router'
  import axios from 'axios'
  
  const route = useRoute()
  const favorites = ref([])
  const isLoading = ref(false)
  const error = ref(null)
  const userId = route.params.id
  const showModal = ref(false) // Control del modal
  const selectedAnimal = ref({}) // Animal seleccionado para mostrar en el modal
  
  const fetchFavorites = async () => {
    isLoading.value = true
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`http://localhost:4000/api/favorites/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      })
  
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text()
        throw new Error(`Respuesta inesperada: ${textResponse.substring(0, 100)}...`)
      }
  
      const data = response.data
      console.log('Datos de favoritos recibidos:', data)
  
      if (Array.isArray(data)) {
        favorites.value = data.map(animal => ({
            ...animal,
          images: Array.isArray(animal.images) && animal.images.length > 0 ? 
          animal.images.map(img => `http://localhost:4000/uploads/${img}`) : 
          []
        }))
      } else {
        console.error('La respuesta de favoritos no es un array:', data)
        error.value = 'Error al cargar los favoritos'
        favorites.value = []
      }
  
    } catch (error) {
      console.error('Error al obtener favoritos:', error)
      error.value = error.message
      favorites.value = []
    } finally {
      isLoading.value = false
    }
  }

  const isFavorite = (animalId) => {
  return favorites.value.includes(animalId)
}

const toggleFavorite = async (animalId) => {
  console.log('toggleFavorite llamado con ID:', animalId)

  try {
    if (favorites.value.some(fav => fav.id === animalId)) {
      // eliminar de favoritos
      await axios.delete(`http://localhost:4000/api/favorites`, {
        data: { userId: userId, animalId }
      })
      favorites.value = favorites.value.filter(fav => fav.id !== animalId)
      closeModal();
    } else {
      // agregar a favoritos (esto no debería ocurrir en la página de favoritos, pero por consistencia)
      await axios.post('http://localhost:4000/api/favorites', {
        userId: userId,
        animalId
      })
      // Si el animal ya existe en la lista mostrada, no duplicarlo.
      //Volver a cargar la pagina
      if (!favorites.value.some(fav => fav.id === animalId)) {
        await fetchFavorites();
      }
    }
  } catch (error) {
    console.error('Error al cambiar favorito:', error)
  }
}

const heartColor = computed(() => {
  return favorites.value?.some(fav => fav.id === selectedAnimal.value.id) ? 'red' : 'gray';
});

// Abrir modal con los detalles del animal
const openAnimalDetail = async (animal) => {
  selectedAnimal.value = animal;
  showModal.value = true;
};

// Cerrar el modal
function closeModal() {
  showModal.value = false
}
  
  onMounted(() => {
    fetchFavorites()
  })
  </script>
  
  <style scoped>
  /* Estilos específicos para este componente de favoritos */
  .favorites {
    padding: 20px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    color: #333;
    flex-grow: 1;
  }
  
  .favorites h2 {
    margin-bottom: 24px;
    font-size: 1.8rem;
    color: #2c3e50;
    position: relative;
    padding-bottom: 10px;
  }
  
  .favorites h2:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 40px;
    height: 3px;
    background-color: #e53935; /* Un color diferente para distinguirlo */
  }
  
  .animal-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 24px;
    margin-top: 20px;
  }
  
  .animal-card {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
  }
  
  .animal-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.15);
  }
  
  .card-image-container {
    width: 100%;
    height: 220px;
    overflow: hidden;
  }
  
  .card-image-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  
  .animal-card:hover .card-image-container img {
    transform: scale(1.1);
  }
  
  .card-content {
    padding: 20px;
  }
  
  .card-content h3 {
    margin: 0 0 12px 0;
    font-size: 1.4rem;
    color: #2c3e50;
  }
  
  .card-content p {
    margin: 8px 0;
    color: #5a6a7a;
  }
  
  .card-content .label {
    font-weight: 600;
    color: #2c3e50;
  }
  
  .no-results {
    padding: 30px;
    text-align: center;
    background: #f8f8f8;
    border-radius: 12px;
    margin-top: 20px;
  }

  .heart-icon {
  position: absolute;
  right: 40px;
  bottom: 210px;
  width: 32px;
  height: 32px;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 3;
}
/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 16px;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from { transform: translateY(30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.close-modal {
  background: #f44336;
  color: white;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 15px;
  right: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 3;
}

.close-modal:hover {
  background: #e53935;
  transform: rotate(90deg);
}

.modal-content h2 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 2rem;
  color: #2c3e50;
}

.modal-image-container {
  width: 100%;
  height: 300px;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 20px;
}

.modal-image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal-details p {
  margin: 12px 0;
  font-size: 1.05rem;
  line-height: 1.6;
}

.modal-details strong {
  color: #2c3e50;
}
  
  /* Loader */
  .loader-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 300px;
    width: 100%;
  }
  
  .loader {
    border: 5px solid rgba(76, 175, 80, 0.1);
    border-top: 5px solid #e53935; /* Color del loader consistente con el título */
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  /* Responsive design */
@media (max-width: 900px) {
  .layout {
    flex-direction: column;
  }
  
  .filters {
    width: 100%;
    position: static;
    margin-bottom: 20px;
  }
  
  .button-group button {
    flex: 1 0 30%;
  }
}

@media (max-width: 600px) {
  .animal-cards {
    grid-template-columns: 1fr;
  }
  
  .button-group button {
    flex: 1 0 45%;
  }
  
  .modal-content {
    width: 95%;
    padding: 20px;
  }
  
  .modal-image-container {
    height: 220px;
  }
}
  </style>