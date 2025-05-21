<template>
  <div class="adopt-page">
    <div class="layout">
      
      <!-- FILTROS como botones con aplicación automática -->
      <aside class="filters">
        <h2>Filtros de búsqueda</h2>

        <div class="filter-group">
          <label>Especie:</label>
          <div class="button-group">
            <button :class="{ active: filters.species === 'perro' }" @click="setFilterAndApply('species', 'perro')">Perro</button>
            <button :class="{ active: filters.species === 'gato' }" @click="setFilterAndApply('species', 'gato')">Gato</button>
            <button :class="{ active: filters.species === '' }" @click="setFilterAndApply('species', '')">Todos</button>
          </div>
        </div>

        <div class="filter-group">
          <label>Edad:</label>
          <div class="button-group">
            <button :class="{active: filters.minAge === 0 && filters.maxAge === 2}" @click="setAgeFilterAndApply(0, 2)">0-2 años</button>
            <button :class="{active: filters.minAge === 3 && filters.maxAge === 6}" @click="setAgeFilterAndApply(3, 6)">3-6 años</button>
            <button :class="{active: filters.minAge === 7 && filters.maxAge === 99}" @click="setAgeFilterAndApply(7, 99)">7+ años</button>
          </div>
        </div>

        <div class="filter-group">
          <label>Tamaño:</label>
          <div class="button-group">
            <button :class="{ active: filters.size === 'Pequeño' }" @click="setFilterAndApply('size', 'Pequeño')">Pequeño</button>
            <button :class="{ active: filters.size === 'Mediano' }" @click="setFilterAndApply('size', 'Mediano')">Mediano</button>
            <button :class="{ active: filters.size === 'Grande' }" @click="setFilterAndApply('size', 'Grande')">Grande</button>
            <button :class="{ active: filters.size === '' }" @click="setFilterAndApply('size', '')">Todos</button>
          </div>
        </div>

        <div class="filter-group">
          <label>Ubicación:</label>
          <div class="button-group">
            <button :class="{ active: filters.location === 'Cali - Colombia' }" @click="setFilterAndApply('location', 'Cali - Colombia')">Cali - Colombia</button>
            <button :class="{ active: filters.location === 'Otra' }" @click="setFilterAndApply('location', 'Otra')">Otra</button>
            <button :class="{ active: filters.location === '' }" @click="setFilterAndApply('location', '')">Todas</button>
          </div>
        </div>

        <button class="clear-button" @click="clearFilters">Borrar filtros</button>

      </aside>

      <!-- Listado de animales -->
      <div v-if="isLoading" class="loader-container">
        <div class="loader"></div>
      </div>
      <section class="animal-list">
        <h2>Animales disponibles</h2>
        <div v-if="filteredAnimals.length === 0 && !isLoading" class="no-results">
          <p>No se encontraron animales con los filtros seleccionados</p>
        </div>
        <div class="animal-cards" v-else>
          <div class="animal-card" v-for="animal in filteredAnimals" :key="animal.id" @click="openAnimalDetail(animal)">
            <div class="card-image-container">
              <img v-if="animal.images && animal.images.length > 0" :src="animal.images[0]" alt="Animal">
              <img v-else src="https://via.placeholder.com/300x200?text=No+Image" alt="Animal">
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
      </section>

    </div>

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
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'

const route = useRoute()
const userId = route.params.id
const animals = ref([]) // Lista de animales filtrados
const favorites = ref([]);
const isLoading = ref(false)
const error = ref(null)
const filters = ref({
  species: '',
  minAge: null,
  maxAge: null,
  size: '',
  location: ''
})

const showModal = ref(false) // Control del modal
const selectedAnimal = ref({}) // Animal seleccionado para mostrar en el modal

// Configurar los filtros y aplicar inmediatamente
function setFilterAndApply(key, value) {
  filters.value[key] = value
  //filteredAnimals() // Aplicar filtros automáticamente
}

function setAgeFilterAndApply(min, max) {
  filters.value.minAge = min
  filters.value.maxAge = max
  //filteredAnimals() // Aplicar filtros automáticamente
}

// Función para borrar los filtros
const clearFilters = () => {
  filters.value = {
    species: '',
    minAge: null,
    maxAge: null,
    size: '',
    location: ''
  };
  //filteredAnimals(); // Mostrar todos los animales sin filtros
}

// Obtener animales del backend
const fetchAnimals = async () => {
  isLoading.value = true;
  try {
    const token = localStorage.getItem('token'); // Obtener el token
    const response = await axios.get(`http://localhost:4000/api/animals/adopt`, {
      headers: {
        'Authorization': `Bearer ${token}`, // Envía el token
        'Accept': 'application/json'
      }
    });

    const contentType = response.headers.get('content-type');
    
    if (!contentType || !contentType.includes('application/json')) {
      const textResponse = await response.text();
      throw new Error(`Respuesta inesperada: ${textResponse.substring(0, 100)}...`);
    }

    const data = response.data
    console.log('Datos recibidos:', data);

    if (!Array.isArray(data)) {
      console.error('La respuesta no es un array:', data);
      throw new Error('La respuesta no es un array válido');
    }

    animals.value = data.map(animal => {
      console.log('Procesando animal:', animal);
      return {
        ...animal,
        images: Array.isArray(animal.images) && animal.images.length > 0 ? 
          animal.images.map(img => `http://localhost:4000/uploads/${img}`) : 
          []
      };
    });
    
    console.log('Animals después de mapeo:', animals.value);

  } catch (error) {
    console.error("Error:", error);
    error.value = error.message;
  } finally {
    isLoading.value = false;
  }
}

// Obtener animales con filtros
const filteredAnimals = computed(() => {
  let filteredList = animals.value;
  console.log('Aplicando filtros. Estado actual de filters:', filters.value); // Depuración 1
    console.log('Total de animales antes de filtrar:', filteredList.length); // Depuración 2

  if (filters.value.species) {
    filteredList = filteredList.filter(animal =>
      animal.species?.toLowerCase() === filters.value.species.toLowerCase()
    );
  }
  if (filters.value.minAge !== null && filters.value.maxAge !== null) {
    filteredList = filteredList.filter(animal =>
      animal.age >= filters.value.minAge && animal.age <= filters.value.maxAge
    );
  }
  if (filters.value.size) {
    filteredList = filteredList.filter(animal =>
      animal.size === filters.value.size
    );
  }
  if (filters.value.location) {
    filteredList = filteredList.filter(animal =>
      animal.location === filters.value.location
    );
  }
  return filteredList;
});

const fetchFavorites = async () => {
      if (!userId) return;
      const res = await axios.get(`/api/favorites/${userId}`);
      favorites.value = res.data.map(a => a.id);
      console.log("Respuesta de fetchFavorites:", favorites.value);

}

const isFavorite = (animalId) => {
  return favorites.value.includes(animalId)
}

const toggleFavorite = async (animalId) => {
  console.log('toggleFavorite llamado con ID:', animalId) // ← este debe mostrar el ID correctamente

  try {
    if (isFavorite(animalId)) {
      // eliminar de favoritos
      await axios.delete(`http://localhost:4000/api/favorites`, {
        data: { userId: userId, animalId }
      })
      favorites.value = favorites.value.filter(id => id !== animalId)
    } else {
      // agregar a favoritos
      await axios.post('http://localhost:4000/api/favorites', {
        userId: userId,
        animalId
      })
      favorites.value.push(animalId)
    }
  } catch (error) {
    console.error('Error al cambiar favorito:', error)
  }
}

const heartColor = computed(() => {
  return favorites.value?.includes(selectedAnimal.value.id) ? 'red' : 'gray';
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
  fetchAnimals();
  fetchFavorites();
});
</script>

<style scoped>
.adopt-page {
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
}

.layout {
  display: flex;
  gap: 30px;
}

/* Filtros */
.filters {
  width: 280px;
  background: #f8f8f8;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 20px;
  height: fit-content;
}

.filters h2 {
  margin-bottom: 24px;
  font-size: 1.5rem;
  color: #2c3e50;
  position: relative;
  padding-bottom: 10px;
}

.filters h2:after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40px;
  height: 3px;
  background-color: #4caf50;
}

.filter-group {
  margin-bottom: 24px;
}

.filter-group label {
  display: block;
  margin-bottom: 12px;
  font-weight: 600;
  color: #2c3e50;
}

.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.button-group button {
  flex: 1 0 45%;
  padding: 10px 15px;
  background: #e9f5ea;
  border: 1px solid #d4e8d5;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-weight: 500;
  color: #2c3e50;
  position: relative;
  overflow: hidden;
}

.button-group button:before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background-color: rgba(76, 175, 80, 0.2);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.3s ease, height 0.3s ease;
}

.button-group button:hover:before {
  width: 300px;
  height: 300px;
}

.button-group button:hover {
  background: #d4e8d5;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.button-group button:active {
  transform: translateY(1px);
}

.button-group button.active {
  background: #4caf50;
  color: white;
  border-color: #3d9140;
  box-shadow: 0 2px 5px rgba(76, 175, 80, 0.3);
}

.clear-button {
  margin-top: 20px;
  width: 100%;
  padding: 12px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(244, 67, 54, 0.3);
}

.clear-button:hover {
  background-color: #e53935;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(244, 67, 54, 0.4);
}

.clear-button:active {
  transform: translateY(1px);
}

/* Animales */
.animal-list {
  flex-grow: 1;
}

.animal-list h2 {
  margin-bottom: 24px;
  font-size: 1.8rem;
  color: #2c3e50;
  position: relative;
  padding-bottom: 10px;
}

.animal-list h2:after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40px;
  height: 3px;
  background-color: #4caf50;
}

.animal-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.animal-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
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
  border-top: 5px solid #4CAF50;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.no-results {
  padding: 30px;
  text-align: center;
  background: #f8f8f8;
  border-radius: 12px;
  margin: 20px 0;
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
