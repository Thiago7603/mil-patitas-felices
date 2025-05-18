<template>
  <div class="notifications">
    <h2>Notificaciones</h2>
    <ul v-if="notifications.length > 0">
      <li v-for="note in notifications" :key="note.id">
        <p>{{ note.message }}</p>
        <small>{{ formatDate(note.created_at) }}</small>
      </li>
    </ul>
    <p v-else>No tienes notificaciones</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
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
        // Aquí llamas a tu endpoint backend de notificaciones
        const response = await axios.get('http://localhost:4000/api/notifications', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}` // o como manejes el token
          }
        });
        this.notifications = response.data;
      } catch (err) {
        this.error = 'Error al cargar notificaciones';
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    formatDate(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleString();
    }
  },
  mounted() {
    this.fetchNotifications();
  }
};
</script>

<style scoped>
.notifications {
  border: 1px solid #ccc;
  padding: 1em;
  max-width: 400px;
  background: #f9f9f9;
  border-radius: 8px;
}
.notifications ul {
  list-style: none;
  padding: 0;
}
.notifications li {
  margin-bottom: 1em;
  padding-bottom: 0.5em;
  border-bottom: 1px solid #ddd;
}
</style>
