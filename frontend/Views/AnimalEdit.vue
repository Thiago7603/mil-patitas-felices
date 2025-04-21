<template>
  <div class="animal-edit-container">
    <div class="edit-section">
      <h1 class="edit-title">Editar Publicación</h1>
      <div class="edit-form-container">
        <EditAnimal 
          :animalId="animalId" 
          @animal-updated="handleAnimalUpdated"
        />
      </div>
    </div>
    
    <div class="delete-section">
      <h3 class="delete-title">Eliminar Publicación</h3>
      <p class="delete-warning">Esta acción es permanente y no se puede deshacer</p>
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
        <h3 class="modal-title">¿Confirmas que quieres eliminar esta publicación?</h3>
        <p class="modal-text">Toda la información del animal será eliminada permanentemente</p>
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
  margin: 2rem auto;
  padding: 0 1.5rem;
}

.edit-section {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 2rem;
  margin-bottom: 2rem;
}

.edit-title {
  color: #2c3e50;
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  text-align: center;
}

.edit-form-container {
  margin-top: 1.5rem;
}

.delete-section {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 2rem;
  border-top: 4px solid #ff6b6b;
}

.delete-title {
  color: #2c3e50;
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.delete-warning {
  color: #7f8c8d;
  font-size: 0.95rem;
  margin-bottom: 1.5rem;
}

.delete-button {
  background-color: #ff6b6b;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  font-size: 1rem;
  transition: all 0.3s ease;
  width: 100%;
  max-width: 250px;
  display: block;
  margin: 0 auto;
}

.delete-button:hover {
  background-color: #ff5252;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(255, 107, 107, 0.3);
}

.delete-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.error-message {
  color: #d32f2f;
  margin-top: 1rem;
  text-align: center;
  font-size: 0.9rem;
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
  backdrop-filter: blur(2px);
}

.modal-content {
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.modal-title {
  color: #2c3e50;
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.modal-text {
  color: #7f8c8d;
  font-size: 1rem;
  line-height: 1.5;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.modal-actions button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.confirm-delete {
  background-color: #ff6b6b;
  color: white;
}

.confirm-delete:hover {
  background-color: #ff5252;
  transform: translateY(-2px);
}

.cancel-delete {
  background-color: #f1f3f5;
  color: #2c3e50;
}

.cancel-delete:hover {
  background-color: #e1e4e7;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .animal-edit-container {
    padding: 0 1rem;
  }
  
  .edit-section, .delete-section {
    padding: 1.5rem;
  }
  
  .modal-content {
    padding: 1.5rem;
  }
  
  .modal-actions {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .modal-actions button {
    width: 100%;
  }
}
</style>