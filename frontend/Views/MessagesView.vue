<template>
  <div class="messages-view">
    <div class="header">
      <h2>
        <span class="icon">📬</span>
        Mensajes
      </h2>
    </div>

    <!-- Contenedor principal -->
    <div class="chat-container">
      <!-- Botón para nueva conversación -->
      <button 
        v-if="!conversationStarted" 
        @click="startConversation" 
        class="btn-new-chat"
      >
        <span class="icon">+</span> Iniciar chat
      </button>

      <!-- Área de mensajes -->
      <div class="messages-area">
        <!-- Mensajes existentes -->
        <div v-if="messages.length" class="messages-list">
          <div
            v-for="(msg, index) in messages"
            :key="index"
            class="message"
            :class="{ 'my-message': msg.sender_id === userId, 'bot-message': msg.sender_id === 0 }"
          >
            <div class="message-header">
              <strong>{{ msg.sender_id === userId ? 'Yo' : 'MilPatitasFelices' }}</strong>
              <small>{{ formatTime(msg.created_at) }}</small>
            </div>
            <div class="message-content">{{ msg.content }}</div>
          </div>
        </div>

        <!-- Estado vacío -->
        <div v-else class="empty-state">
          <p>No hay mensajes aún</p>
        </div>
      </div>

      <!-- Sección de adopción -->
      <div v-if="conversationStarted" class="adoption-section">
        <div v-if="!userAnimals.length" class="adoption-prompt">
          <button @click="quieroAdoptar" class="btn-adopt">
            <span class="icon">🐾</span> Quiero adoptar
          </button>
        </div>

        <div v-if="userAnimals.length" class="animals-list">
          <h3>Selecciona un animal:</h3>
          <div class="animal-card" v-for="animal in userAnimals" :key="animal.id">
            <div class="animal-info">
              <span class="animal-name">{{ animal.name }}</span>
              <span class="animal-type">{{ animal.type }}</span>
            </div>
            <button @click="enviarSolicitud(animal.id)" class="btn-request">
              Solicitar adopción
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const userId = parseInt(route.params.id);
const receiverId = 2; // ID del refugio

// Datos reactivos
const messages = ref([]);
const conversationStarted = ref(false);
const userAnimals = ref([]);
const loading = ref(false);

// Formatear hora
const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Cargar mensajes
const fetchMessages = async () => {
  loading.value = true;
  try {
    const response = await axios.get(`http://localhost:4000/api/messages/${userId}`);
    messages.value = response.data;
  } catch (error) {
    console.error('Error al cargar mensajes', error);
  } finally {
    loading.value = false;
  }
};

// Iniciar conversación
const startConversation = () => {
  messages.value.push({
    sender_id: 0,
    content: `¡Hola! ¿En qué podemos ayudarte hoy?`,
    created_at: new Date().toISOString()
  });
  conversationStarted.value = true;
};

// Mostrar animales
const quieroAdoptar = async () => {
  try {
    const token = localStorage.getItem('token');
    const res = await axios.get(`http://localhost:4000/api/animals/adopt/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    userAnimals.value = res.data;
    
    messages.value.push({
      sender_id: 0,
      content: 'Estos son los animales disponibles para adopción:',
      created_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error al obtener animales:', error);
  }
};

// Enviar solicitud
const enviarSolicitud = async (animalId) => {
  try {
    const token = localStorage.getItem('token');
    await axios.post('http://localhost:4000/api/adoption/request', {
      animal_id: animalId,
      user_id: userId,
      message: 'Solicitud de adopción',
      status: 'pendiente'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    messages.value.push({
      sender_id: 0,
      content: '¡Solicitud enviada! Nos pondremos en contacto contigo pronto.',
      created_at: new Date().toISOString()
    });

    userAnimals.value = [];
  } catch (error) {
    console.error('Error al enviar solicitud:', error);
  }
};

onMounted(fetchMessages);
</script>

<style scoped>
/* Estilos generales */
.messages-view {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  text-align: center;
  margin-bottom: 20px;
}

.header h2 {
  color: #2c3e50;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.icon {
  font-size: 1.2em;
}

/* Contenedor del chat */
.chat-container {
  background-color: #f9f9f9;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.199);
}

/* Botones */
button {
  cursor: pointer;
  border: none;
  border-radius: 5px;
  padding: 10px 15px;
  font-weight: 500;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-new-chat {
  background-color: #027441;
  color: white;
  margin-bottom: 20px;
}

.btn-new-chat:hover {
  background-color: #027441;
}

.btn-adopt {
  background-color: #027441;
  color: white;
}

.btn-adopt:hover {
  background-color: #027441;
}

.btn-request {
  background-color: #48c774;
  color: white;
  font-size: 0.9em;
}

.btn-request:hover {
  background-color: #3db16b;
}

/* Mensajes */
.messages-area {
  min-height: 300px;
  margin-bottom: 20px;
}

.message {
  max-width: 70%;
  margin-bottom: 15px;
  padding: 12px;
  border-radius: 10px;
  position: relative;
}

.message-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  font-size: 0.9em;
  color: #027441;
}

.message-content {
  word-wrap: break-word;
}

.my-message {
  background-color: #dcf8c6;
  margin-left: auto;
  border-top-right-radius: 0;
}

.bot-message {
  background-color: #e6e6e6;
  margin-right: auto;
  border-top-left-radius: 0;
}

/* Lista de animales */
.animals-list {
  margin-top: 20px;
}

.animal-card {
  background: white;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.147);
}

.animal-info {
  display: flex;
  flex-direction: column;
}

.animal-name {
  font-weight: bold;
}

.animal-type {
  font-size: 0.8em;
  color: #666;
}

/* Estados */
.empty-state {
  text-align: center;
  padding: 40px;
  color: #666;
}

.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 20px;
}

.spinner {
  border: 3px solid rgba(0,0,0,0.1);
  border-radius: 50%;
  border-top: 3px solid #027441;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 600px) {
  .messages-view {
    padding: 10px;
  }
  
  .message {
    max-width: 85%;
  }
}
</style>