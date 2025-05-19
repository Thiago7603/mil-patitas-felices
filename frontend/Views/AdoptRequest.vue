<template>
  <div class="requests-container">
    <h2 class="section-title">
      <i class="fas fa-clipboard-list"></i> Solicitudes de Adopción (En Revisión)
    </h2>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <span>Cargando solicitudes...</span>
    </div>

    <div v-else>
      <div v-if="error" class="error-message">
        <i class="fas fa-exclamation-triangle"></i>
        <p>{{ error }}</p>
        <button @click="fetchRequests" class="retry-btn">
          <i class="fas fa-sync-alt"></i> Reintentar
        </button>
      </div>

      <div v-if="requests.length" class="requests-list">
        <div v-for="req in requests" :key="req.id" class="request-card">
          <div class="request-info">
            <p><i class="fas fa-paw"></i> <strong>Animal:</strong> {{ req.animal_name }}</p>
            <p><i class="fas fa-user"></i> <strong>Adoptante:</strong> {{ req.adoptante_name }}</p>
            <p><i class="fas fa-info-circle"></i> <strong>Estado:</strong> 
              <span class="status-badge" :class="req.status.toLowerCase()">{{ req.status }}</span>
            </p>
          </div>
          
          <div class="request-actions">
            <button @click="updateStatus(req.id, 'aceptada')" class="accept-btn">
              <i class="fas fa-check"></i> Aceptar
            </button>
            <button @click="updateStatus(req.id, 'rechazada')" class="reject-btn">
              <i class="fas fa-times"></i> Rechazar
            </button>
          </div>
        </div>
      </div>

      <div v-else class="empty-state">
        <i class="fas fa-inbox"></i>
        <p>No hay solicitudes pendientes</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';

const route = useRoute();
const refugioId = parseInt(route.params.id);
const requests = ref([]);
const loading = ref(false);
const error = ref(null);

const fetchRequests = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      error.value = 'No hay token de autenticación';
      return;
    }

    const res = await axios.get('http://localhost:4000/api/requests', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
      }
    });

    requests.value = res.data;
  } catch (err) {
    console.error('Error al obtener solicitudes', err);
    error.value = err.response?.data?.message || 'Error al cargar solicitudes';
  } finally {
    loading.value = false;
  }
};

const updateStatus = async (requestId, status) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      error.value = 'No hay token de autenticación';
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
  } catch (err) {
    console.error('Error al actualizar estado', err);
    error.value = err.response?.data?.message || 'Error al actualizar estado';
  }
};

onMounted(fetchRequests);
</script>

<style scoped>
.requests-container {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.section-title {
  color: #333;
  font-size: 1.5rem;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-title i {
  color: #027441;
}

/* Estados */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;
  color: #666;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid #027441;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  padding: 15px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.retry-btn {
  background-color: #027441;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
  margin-left: auto;
  transition: background-color 0.3s;
}

.retry-btn:hover {
  background-color: #015a34;
}

.empty-state {
  text-align: center;
  padding: 30px;
  color: #666;
}

.empty-state i {
  font-size: 2rem;
  margin-bottom: 10px;
  color: #aaa;
}

/* Lista de solicitudes */
.requests-list {
  display: grid;
  gap: 15px;
}

.request-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.request-info {
  flex-grow: 1;
}

.request-info p {
  margin: 8px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.request-info i {
  color: #027441;
  width: 20px;
  text-align: center;
}

.status-badge {
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-badge.aceptada {
  background-color: #d4edda;
  color: #155724;
}

.status-badge.rechazada {
  background-color: #f8d7da;
  color: #721c24;
}

.status-badge.en.revisión, .status-badge.en_revisión {
  background-color: #fff3cd;
  color: #856404;
}

.request-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.request-actions button {
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.2s;
}

.accept-btn {
  background-color: #027441;
  color: white;
}

.accept-btn:hover {
  background-color: #015a34;
}

.reject-btn {
  background-color: #dc3545;
  color: white;
}

.reject-btn:hover {
  background-color: #c82333;
}

/* Animaciones */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 768px) {
  .requests-container {
    padding: 15px;
  }
  
  .request-card {
    padding: 15px;
  }
  
  .request-actions {
    flex-direction: column;
  }
  
  .request-actions button {
    width: 100%;
    justify-content: center;
  }
}
</style>