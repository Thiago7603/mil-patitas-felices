<template>
  <div class="adopt-requests">
    <h2>📋 Solicitudes de Adopción (En Revisión)</h2>

    <div v-if="requests.length">
      <div v-for="req in requests" :key="req.id" class="request-card">
        <p><strong>Animal:</strong> {{ req.animal_name }}</p>
        <p><strong>Adoptante:</strong> {{ req.adoptante_name }}</p>
        <p><strong>Estado:</strong> {{ req.status }}</p>

        <button @click="updateStatus(req.id, 'aceptada')">✅ Aceptar</button>
        <button @click="updateStatus(req.id, 'rechazada')">❌ Rechazar</button>
      </div>
    </div>
    <div v-else>
      <p>No hay solicitudes pendientes.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';

const route = useRoute();
const refugioId = parseInt(route.params.id); // id del refugio logueado

const requests = ref([]);

const fetchRequests = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('No hay token de autenticación');
      return;
    }

    const res = await axios.get('http://localhost:4000/api/requests', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
      }
    });

    console.log('Datos recibidos:', res.data);  // <---- Aquí
    requests.value = res.data;
  } catch (error) {
    console.error('Error al obtener solicitudes', error);
  }
};


const updateStatus = async (requestId, status) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('No hay token de autenticación');
      return;
    }

    await axios.put(
      `http://localhost:4000/api/requests/${requestId}`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    fetchRequests();
  } catch (error) {
    console.error('Error al actualizar estado', error);
  }
};


onMounted(fetchRequests);
</script>


<style scoped>
.adopt-requests {
  padding: 1rem;
}

.request-card {
  border: 1px solid #ccc;
  padding: 1rem;
  margin: 0.5rem 0;
  border-radius: 8px;
}

button {
  margin-right: 0.5rem;
}
</style>
