<template>
  <div class="messages-view">
    <h2>📬 Mensajes</h2>

    <!-- Botón para iniciar una conversación -->
    <button v-if="!conversationStarted" @click="startConversation">+ Nueva Conversación</button>

    <!-- Conversación en curso -->
    <div v-if="messages.length">
      <div
        v-for="(msg, index) in messages"
        :key="index"
        class="message"
        :class="{ 'from-you': msg.sender_id === userId, 'from-bot': msg.sender_id === 0 }"
      >
        <strong>{{ msg.sender_id === userId ? 'Tú' : '🤖 Bot' }}:</strong> {{ msg.content }}
      </div>
    </div>
    <div v-else>
      <p>No hay mensajes aún.</p>
    </div>

    <!-- Botón "Quiero adoptar" -->
    <div v-if="conversationStarted && !userAnimals.length">
      <button @click="quieroAdoptar">🐾 Quiero adoptar</button>
    </div>

    <!-- Lista de animales -->
    <div v-if="userAnimals.length">
      <p>Selecciona el animal que quieres adoptar:</p>
      <ul>
        <li v-for="animal in userAnimals" :key="animal.id">
          {{ animal.name }}
          <button @click="enviarSolicitud(animal.id)">Adoptar</button>
        </li>
      </ul>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const userId = parseInt(route.params.id); // ID del adoptante

const receiverId = 2; // Supuesto ID del refugio (ajústalo si es dinámico)

const messages = ref([]);
const newMessage = ref('');
const conversationStarted = ref(false);
const userAnimals = ref([]);

// Cargar mensajes previos
const fetchMessages = async () => {
  try {
    const response = await axios.get(`http://localhost:4000/api/messages/${userId}`);
    messages.value = response.data;
  } catch (error) {
    console.error('Error al cargar mensajes', error);
  }
};

// Iniciar conversación con el bot
const startConversation = () => {
  messages.value.push({
    sender_id: 0,
    content: `¡Hola adoptante #${userId}! ¿Te gustaría adoptar un animal hoy?`,
  });
  conversationStarted.value = true;
};

// Mostrar animales del adoptante
const quieroAdoptar = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No hay token en localStorage');
      return;
    }
    
    const res = await axios.get(`http://localhost:4000/api/animals/adopt/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
      }
    });
    
    userAnimals.value = res.data;
    
    messages.value.push({
      sender_id: 0,
      content: 'Aquí están los animales disponibles para que puedas iniciar tu proceso de adopción. 🐶🐱',
    });
  } catch (error) {
    console.error('Error al obtener animales del usuario:', error);
  }
};



// Enviar solicitud de adopción (ticket)
const enviarSolicitud = async (animalId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No hay token en localStorage');
      return;
    }

    await axios.post('http://localhost:4000/api/adoption/request', {
        animal_id: animalId,
        user_id: userId,
        message: 'Me gustaría adoptar este animal',
        status: 'en revisión'
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
      }
    });

    messages.value.push({
      sender_id: 0,
      content: 'Tu solicitud ha sido enviada correctamente al refugio. 📨',
    });

    userAnimals.value = [];
    conversationStarted.value = false;
  } catch (error) {
    console.error('Error al enviar la solicitud de adopción:', error);
  }
};

onMounted(fetchMessages);
</script>

<style scoped>
.messages-view {
  padding: 1rem;
}

.message {
  margin: 0.5rem 0;
  padding: 0.5rem;
  border-radius: 8px;
  max-width: 70%;
}

.from-you {
  background-color: #dcf8c6;
  align-self: flex-end;
}

.from-bot {
  background-color: #e6e6e6;
  font-style: italic;
}

form {
  margin-top: 1rem;
}

button {
  margin-left: 0.5rem;
  margin-top: 0.5rem;
}
</style>
