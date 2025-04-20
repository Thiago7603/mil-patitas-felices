<template>
    <div class="animal-edit-container">
      <h1>Editar Publicación</h1>
      <EditAnimal 
        :animalId="animalId" 
        @animal-updated="handleAnimalUpdated"
      />
      
      <!-- Sección de eliminación (mostrada siempre) -->
      <div class="delete-section">
        <h3>Eliminar Publicación</h3>
        <p>Esta acción es permanente y no se puede deshacer</p>
        <button 
          @click="confirmDelete"
          class="delete-button"
          :disabled="isDeleting"
        >
          {{ isDeleting ? 'Eliminando...' : 'Eliminar Animal' }}
        </button>
        <p v-if="deleteError" class="error-message">{{ deleteError }}</p>
      </div>
  
      <!-- Modal de confirmación -->
      <div v-if="showDeleteModal" class="modal-overlay">
        <div class="modal-content">
          <h3>¿Confirmas que quieres eliminar esta publicación?</h3>
          <p>Toda la información del animal será eliminada permanentemente</p>
          <div class="modal-actions">
            <button @click="deleteAnimal" class="confirm-delete">Sí, Eliminar</button>
            <button @click="showDeleteModal = false" class="cancel-delete">Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { useRoute, useRouter } from 'vue-router';
  import { ref } from 'vue';
  import EditAnimal from '@/components/EditAnimal.vue';
  
  export default {
    components: { EditAnimal },
    setup() {
      const route = useRoute();
      const router = useRouter();
      const animalId = route.params.id;
      
      const isDeleting = ref(false);
      const showDeleteModal = ref(false);
      const deleteError = ref('');
  
      const confirmDelete = () => {
        showDeleteModal.value = true;
      };
  
      const deleteAnimal = async () => {
        isDeleting.value = true;
        deleteError.value = '';
        
        const token = localStorage.getItem('token');
        if (!token) {
          deleteError.value = 'Debes iniciar sesión';
          return router.push('/user/login');
        }
  
        try {
          const response = await axios.delete(
            `/api/animals/${animalId}`,
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );
  
          if (response.data.success) {
            router.push('/registrar-animal');
          }
        } catch (error) {
          console.error('Error al eliminar:', error);
          
          if (error.response?.status === 404) {
            deleteError.value = 'El animal no existe';
          } else {
            deleteError.value = 'Error al eliminar. Intenta nuevamente.';
          }
        } finally {
          isDeleting.value = false;
          showDeleteModal.value = false;
        }
      };
  
      const handleAnimalUpdated = () => {
        console.log('Animal actualizado correctamente');
      };
  
      return {
        animalId,
        isDeleting,
        showDeleteModal,
        deleteError,
        confirmDelete,
        deleteAnimal,
        handleAnimalUpdated
      };
    }
  };
  </script>
  
  <style scoped>
  .animal-edit-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .delete-section {
    margin-top: 3rem;
    padding: 1.5rem;
    border: 1px solid #ff6b6b;
    border-radius: 8px;
    background-color: #fff5f5;
  }
  
  .delete-button {
    background-color: #ff6b6b;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 1rem;
  }
  
  .delete-button:hover {
    background-color: #ff5252;
  }
  
  .delete-button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
  
  .error-message {
    color: #d32f2f;
    margin-top: 1rem;
  }
  
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal-content {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    max-width: 500px;
    width: 90%;
  }
  
  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 1.5rem;
  }
  
  .confirm-delete {
    background-color: #ff6b6b;
    color: white;
  }
  
  .cancel-delete {
    background-color: #f1f3f5;
  }
  </style>