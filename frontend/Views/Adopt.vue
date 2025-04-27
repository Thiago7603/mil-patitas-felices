<template>
  <div class="adopt-page">
    <div class="layout">
      
      <!-- FILTROS como botones -->
      <aside class="filters">
        <h2>Filtros de búsqueda</h2>

        <div class="filter-group">
          <label>Especie:</label>
          <div class="button-group">
            <button :class="{ active: filters.species === 'Perro' }" @click="setFilter('species', 'Perro')">Perro</button>
            <button :class="{ active: filters.species === 'Gato' }" @click="setFilter('species', 'Gato')">Gato</button>
            <button :class="{ active: filters.species === '' }" @click="setFilter('species', '')">Todos</button>
          </div>
        </div>

        <div class="filter-group">
          <label>Edad:</label>
          <div class="button-group">
            <button @click="setAgeFilter(0, 2)">0-2 años</button>
            <button @click="setAgeFilter(3, 6)">3-6 años</button>
            <button @click="setAgeFilter(7, 99)">7+ años</button>
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

        <button @click="fetchAnimals">Aplicar filtros</button>
      </aside>

      <!-- Listado de animales -->
      <section class="animal-list">
        <h2>Animales disponibles</h2>
        <div class="animal-cards">
          <div class="animal-card" v-for="animal in animals" :key="animal.id" @click="openAnimalDetail(animal)">
            <img :src="animal.image_url || '/default-animal.png'" alt="Animal">
            <h3>{{ animal.name }}</h3>
            <p>Especie: {{ animal.species }}</p>
            <p>Edad: {{ animal.age }} años</p>
            <p>Tamaño: {{ animal.size }}</p>
            <p>Ubicación: {{ animal.location }}</p>
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
import { ref } from 'vue'
import axios from 'axios'

const animals = ref([]) // Lista de animales filtrados
const filters = ref({
  species: '',
  minAge: '',
  maxAge: '',
  size: '',
  location: ''
})

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

// Obtener animales con filtros
async function fetchAnimals() {
  try {
    const query = new URLSearchParams()

    if (filters.value.species) query.append('species', filters.value.species)
    if (filters.value.minAge !== '') query.append('minAge', filters.value.minAge)
    if (filters.value.maxAge !== '') query.append('maxAge', filters.value.maxAge)
    if (filters.value.size) query.append('size', filters.value.size)
    if (filters.value.location) query.append('location', filters.value.location)

    // Realiza la solicitud al backend para obtener los animales
    const response = await axios.get(`http://localhost:4000/animals?${query.toString()}`)
    animals.value = response.data
  } catch (error) {
    console.error('Error al obtener animales:', error)
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
  background: #4caf50;
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
</style>
