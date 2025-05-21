<template>
  <div class="notifications-wrapper">
    <!-- Título de la sección -->
    <h2 class="section-title">
      <i class="fas fa-bell"></i> Notificaciones
    </h2>

    <!-- Contenedor de notificaciones -->
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <span>Cargando...</span>
    </div>

    <div v-else>
      <!-- Mensaje de error -->
      <div v-if="error" class="error-message">
        <i class="fas fa-exclamation-triangle"></i>
        <p>{{ error }}</p>
        <button @click="fetchNotifications" class="retry-btn">
          <i class="fas fa-sync-alt"></i> Reintentar
        </button>
      </div>

      <!-- Lista de notificaciones -->
      <ul v-if="notifications.length > 0" class="notifications-list">
        <li v-for="note in notifications" :key="note.id" 
            class="notification-card" :class="{ 'unread': !note.read }">
          <div class="notification-icon">
            <i class="fas fa-bell"></i>
          </div>
          <div class="notification-content">
            <p class="message">{{ note.message }}</p>
            <p v-if="note.animal_name"><strong>Animal:</strong> {{ note.animal_name }}</p>
            <span class="timestamp">{{ formatDate(note.created_at) }}</span>
          </div>
          <button v-if="!note.read" @click="deleteNotification(note.id)" 
                  class="mark-read-btn" title="Eliminar notificación">
            <i class="fas fa-check"></i>
          </button>
        </li>
      </ul>

      <!-- Estado vacío -->
      <div v-else class="empty-state">
        <i class="fas fa-bell-slash"></i>
        <p>No tienes notificaciones</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'NotificationsComponent',
  data() {
    return {
      notifications: [],
      loading: false,
      error: null
    };
  },
  methods: {
    async fetchNotifications() {
      this.loading = true;
      this.error = null;

      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No hay token de autenticación');

        const response = await axios.get('http://localhost:4000/api/notifications', {
          headers: { Authorization: `Bearer ${token}` }
        });

        this.notifications = response.data;
      } catch (error) {
        console.error('Error al obtener notificaciones:', error);
        this.error = error.response?.data?.message || 'Error al cargar notificaciones';
      } finally {
        this.loading = false;
      }
    },

    async deleteNotification(id) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:4000/api/notifications/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Actualizar la lista local removiendo la notificación eliminada
        this.notifications = this.notifications.filter(note => note.id !== id);
      } catch (error) {
        console.error('Error al eliminar notificación:', error);
      }
    },

    formatDate(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  },
  mounted() {
    this.fetchNotifications();
  }
};
</script>


<style scoped>
/* Estilos base */
.notifications-wrapper {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  max-width: 600px;
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
.loading-container {
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

/* Lista de notificaciones */
.notifications-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.notification-card {
  display: flex;
  align-items: center;
  padding: 15px;
  margin-bottom: 10px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.notification-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.notification-card.unread {
  border-left: 4px solid #027441;
}

.notification-icon {
  font-size: 1.2rem;
  color: #027441;
  margin-right: 15px;
}

.notification-content {
  flex-grow: 1;
}

.message {
  margin: 0;
  color: #333;
  font-weight: 500;
}

.timestamp {
  display: block;
  margin-top: 5px;
  font-size: 0.8rem;
  color: #666;
}

.mark-read-btn {
  background: none;
  border: none;
  color: #aaa;
  cursor: pointer;
  font-size: 1rem;
  transition: color 0.2s;
}

.mark-read-btn:hover {
  color: #027441;
}

/* Animaciones */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 768px) {
  .notifications-wrapper {
    padding: 15px;
  }
  
  .notification-card {
    padding: 12px;
  }
  
  .notification-icon {
    margin-right: 12px;
  }
}
</style>