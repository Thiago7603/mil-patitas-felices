<template>
  <div class="adopt-page">
    <div class="layout">
      
      <!-- FILTROS como botones -->
      <aside class="filters">
        <h2>Filtros de búsqueda</h2>

        <div class="filter-group">
          <label>Especie:</label>
          <div class="button-group">
            <button :class="{ active: filters.species === 'perro' }" @click="setFilter('species', 'perro')">Perro</button>
            <button :class="{ active: filters.species === 'gato' }" @click="setFilter('species', 'gato')">Gato</button>
            <button :class="{ active: filters.species === '' }" @click="setFilter('species', '')">Todos</button>
          </div>
        </div>

        <div class="filter-group">
          <label>Edad:</label>
          <div class="button-group">
            <button :class="{active: filters.minAge === 0 && filters.maxAge === 2}" @click="setAgeFilter(0, 2)">0-2 años</button>
            <button :class="{active: filters.minAge === 3 && filters.maxAge === 6}" @click="setAgeFilter(3, 6)">3-6 años</button>
            <button :class="{active: filters.minAge === 7 && filters.maxAge === 99}" @click="setAgeFilter(7, 99)">7+ años</button>
          </div>
        </div>

        <div class="filter-group">
          <label>Tamaño:</label>
          <div class="button-group">
            <button :class="{ active: filters.size === 'Pequeño' }" @click="setFilter('size', 'Pequeño')">Pequeño</button>
            <button :class="{ active: filters.size === 'Mediano' }" @click="setFilter('size', 'Mediano')">Mediano</button>
            <button :class="{ active: filters.size === 'Grande' }" @click="setFilter('size', 'Grande')">Grande</button>
            <button :class="{ active: filters.size === '' }" @click="setFilter('size', '')">Todos</button>
          </div>
        </div>

        <div class="filter-group">
          <label>Ubicación:</label>
          <div class="button-group">
            <button :class="{ active: filters.location === 'Ciudad A' }" @click="setFilter('location', 'Ciudad A')">Ciudad A</button>
            <button :class="{ active: filters.location === 'Ciudad B' }" @click="setFilter('location', 'Ciudad B')">Ciudad B</button>
            <button :class="{ active: filters.location === '' }" @click="setFilter('location', '')">Todas</button>
          </div>
        </div>

        <button @click="filteredAnimals">Aplicar filtros</button>
        <button @click="clearFilters">Borrar filtros</button>

      </aside>

      <!-- Listado de animales -->
      <div v-if="isLoading" class="loader-container">
        <div class="loader"></div>
      </div>
      <section class="animal-list">
        <h2>Animales disponibles</h2>
        <div class="animal-cards">
          <div class="animal-card" v-for="animal in animals" :key="animal.id" @click="openAnimalDetail(animal)">
            <div v-for="(image, index) in animal.images" :key="index">
            <img :src="image || '/default-animal.png'" alt="Animal">
            <h3>{{ animal.name }}</h3>
            <p>Especie: {{ animal.species }}</p>
            <p>Edad: {{ animal.age }} años</p>
            <p>Tamaño: {{ animal.size }}</p>
            <p>Ubicación: {{ animal.location }}</p>
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
        <img :src="selectedAnimal.image_url || '/default-animal.png'" alt="Animal" class="animal-image">
        <p><strong>Especie:</strong> {{ selectedAnimal.species }}</p>
        <p><strong>Edad:</strong> {{ selectedAnimal.age }} años</p>
        <p><strong>Tamaño:</strong> {{ selectedAnimal.size }}</p>
        <p><strong>Ubicación:</strong> {{ selectedAnimal.location }}</p>
        <p><strong>Historia:</strong> {{ selectedAnimal.story }}</p>
        <p><strong>Requisitos de adopción:</strong> {{ selectedAnimal.adoption_requirements }}</p>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const animals = ref([]) // Lista de animales filtrados
const isLoading = ref(false)
const error = ref(null)
const filters = ref({
  species: '',
  minAge: null,
  maxAge: null,
  size: '',
  location: ''
})

//const searchQuery = ref('')
const showModal = ref(false) // Control del modal
const selectedAnimal = ref({}) // Animal seleccionado para mostrar en el modal

// Configurar los filtros
function setFilter(key, value) {
  filters.value[key] = value
}

function setAgeFilter(min, max) {
  filters.value.minAge = min
  filters.value.maxAge = max
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
  filteredAnimals(); // Mostrar todos los animales sin filtros
}


// Obtener animales del backend
const fetchAnimals = async () => {
        isLoading.value = true;
        try {
          // Obtén el ID de la URL
          //const refugioId = this.$route.params.id;
          const token = localStorage.getItem('token'); // Obtener el token
          const response = await fetch('http://localhost:4000/api/animals/adopt', {
            headers: {
              'Authorization': `Bearer ${token}`, // Envía el token
              'Accept': 'application/json'
            }
          });

          console.log('Token usado:', localStorage.getItem('token'));
          //console.log('ID de usuario:', refugioId);

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

          animals.value = data.map(animal => ({
            ...animal,
            images: animal.images.map(img => `http://localhost:4000/uploads/${img}`)
          }));

              // Extraer ubicaciones únicas para los filtros
              //const uniqueLocations = [...new Set(response.data.map(a => a.location))]
              //locations.value = uniqueLocations.filter(loc => loc)

        } catch (error) {
          console.error("Error:", error);
          error.value = error.message;
        } finally {
          isLoading.value = false;
        }
      }


// Obtener animales con filtros
const filteredAnimals = async () => {
  isLoading.value = true;
  try {
    //const token = localStorage.getItem('token');
    const query = new URLSearchParams()

    if (filters.value.species) query.append('species', filters.value.species)
    if (filters.value.minAge !== null && filters.value.minAge !== '') query.append('minAge', filters.value.minAge);
    if (filters.value.maxAge !== null && filters.value.maxAge !== '') query.append('maxAge', filters.value.maxAge);
    if (filters.value.size) query.append('size', filters.value.size)
    if (filters.value.location) query.append('location', filters.value.location)

    // Realiza la solicitud al backend para obtener los animales
    const token = localStorage.getItem('token');
    const response = await axios.get(`http://localhost:4000/api/animals/adopt?${query.toString()}`, {
      headers: {
        'Authorization': `Bearer ${token}`, // Enviar el token en los encabezados
      },
    });

    animals.value = response.data

    animals.value = response.data.map(animal => ({
            ...animal,
            images: animal.images.map(img => `http://localhost:4000/uploads/${img}`)
          }));
    } catch (error) {
      console.error("Error:", error);
      error.value = error.message;
    } finally {
      isLoading.value = false;
    }
}

// Abrir modal con los detalles del animal
function openAnimalDetail(animal) {
  selectedAnimal.value = animal
  showModal.value = true
}

// Cerrar el modal
function closeModal() {
  showModal.value = false
}
onMounted(fetchAnimals)
</script>

<style scoped>
.adopt-page {
  padding: 20px;
}

.layout {
  display: flex;
  gap: 30px;
}

/* Filtros */
.filters {
  width: 250px;
  background: #f8f8f8;
  padding: 20px;
  border-radius: 8px;
}

.filters h2 {
  margin-bottom: 20px;
}

.filter-group {
  margin-bottom: 20px;
}

.filter-group label {
  display: block;
  margin-bottom: 10px;
}

.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.button-group button {
  flex: 1 0 45%;
  padding: 8px;
  background: #e0e0e0;
  border: none;
  cursor: pointer;
  border-radius: 6px;
  transition: background-color 0.3s;
}

.button-group button:hover {
  background: #ccc;
}

.button-group button.active {
  background: #10a315;
  color: white;
}

.filters button {
  margin-top: 20px;
  width: 100%;
  padding: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  cursor: pointer;
}

.filters button:hover {
  background-color: #45a049;
}

/* Animales */
.animal-list {
  flex-grow: 1;
}

.animal-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.animal-card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  cursor: pointer;
  transition: box-shadow 0.3s;
}

.animal-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.animal-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
}

.animal-card h3 {
  margin: 10px 0 5px 0;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 10px;
  max-width: 500px;
  width: 100%;
}

.close-modal {
  background: transparent;
  border: none;
  font-size: 20px;
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
}

.loader-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px; /* o lo que se ajuste a tu diseño */
}

.loader {
  border: 8px solid #f3f3f3; /* fondo */
  border-top: 8px solid #4CAF50; /* color de carga */
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

</style>
