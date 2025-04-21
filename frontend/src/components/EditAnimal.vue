<template>
    <form @submit.prevent="submitForm" enctype="multipart/form-data">
      <div>
        <label>Nombre:</label>
        <input v-model="form.name" required />
      </div>
      <div>
        <label>Especie:</label>
        <input v-model="form.species" required />
      </div>
      <div>
        <label>Género:</label>
        <select v-model="form.gender" required>
          <option value="Macho">Macho</option>
          <option value="Hembra">Hembra</option>
        </select>
      </div>
      <div>
        <label>Edad:</label>
        <input v-model.number="form.age" type="number" min="0" required />
      </div>
      <div>
        <label>Tamaño:</label>
        <select v-model="form.size" required>
          <option value="Pequeño">Pequeño</option>
          <option value="Mediano">Mediano</option>
          <option value="Grande">Grande</option>
        </select>
      </div>
      <div>
        <label>Salud:</label>
        <textarea v-model="form.health_status" required></textarea>
      </div>
      <div>
        <label>Historia:</label>
        <textarea v-model="form.story" required></textarea>
      </div>
      <div>
        <label>Requisitos de adopción:</label>
        <textarea v-model="form.adoption_requirements" required></textarea>
      </div>
      <div>
        <label>Ubicación:</label>
        <input v-model="form.location" required />
      </div>
      <div>
        <label>Imágenes (Máx. 5):</label>
        <input 
          type="file" 
          multiple 
          accept="image/*" 
          @change="handleImageChange" 
        />
        <div v-if="imagePreviews.length" class="image-previews">
          <div v-for="(preview, index) in imagePreviews" :key="index" class="preview-item">
            <img :src="preview" alt="Vista previa de imagen" />
          </div>
        </div>
      </div>
      <button type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? 'Actualizando...' : 'Actualizar' }}
      </button>
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
      <div v-if="successMessage" class="success-message">
        {{ successMessage }}
      </div>
    </form>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    props: {
      animalId: {
        type: [String, Number],
        required: true
      }
    },
    data() {
      return {
        form: {
          name: '',
          species: '',
          gender: '',
          age: '',
          size: '',
          health_status: '',
          story: '',
          adoption_requirements: '',
          location: ''
        },
        images: [],
        imagePreviews: [],
        isSubmitting: false,
        errorMessage: '',
        successMessage: ''
      };
    },
    mounted() {
      this.fetchAnimal();
    },
    methods: {
      async fetchAnimal() {
        try {
          const response = await axios.get(`/api/animals/${this.animalId}`);
          this.form = response.data;
          if (response.data.images) {
            this.imagePreviews = response.data.images;
          }
        } catch (error) {
          console.error('Error al cargar datos del animal:', error);
          this.errorMessage = 'Error al cargar los datos del animal';
        }
      },
      handleImageChange(event) {
        this.images = Array.from(event.target.files);
        this.imagePreviews = [];
        
        // Limitar a 5 imágenes
        if (this.images.length > 5) {
          this.images = this.images.slice(0, 5);
          this.errorMessage = 'Solo puedes subir un máximo de 5 imágenes';
        } else {
          this.errorMessage = '';
        }
        
        // Generar vistas previas
        this.images.forEach(file => {
          const reader = new FileReader();
          reader.onload = (e) => {
            this.imagePreviews.push(e.target.result);
          };
          reader.readAsDataURL(file);
        });
      },
      async submitForm() {
        this.isSubmitting = true;
        this.errorMessage = '';
        this.successMessage = '';
        
        const token = localStorage.getItem('token');
        if (!token) {
          this.errorMessage = 'No estás autenticado. Por favor inicia sesión.';
          this.isSubmitting = false;
          return this.$router.push('/user/login');
        }
  
        const formData = new FormData();
        
        // Agregar campos del formulario
        Object.keys(this.form).forEach(key => {
          formData.append(key, this.form[key]);
        });
        
        // Agregar imágenes nuevas
        this.images.forEach(file => {
          formData.append('images', file);
        });
  
        try {
          const response = await axios.put(
            `/api/animals/${this.animalId}`,
            formData,
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
              }
            }
          );
  
          this.successMessage = 'Animal actualizado con éxito';
          setTimeout(() => {
            this.$router.push(`/editar-animal/${this.animalId}`);
          }, 1500);
        } catch (error) {
          console.error('Error al actualizar el animal:', error);
          
          if (error.response) {
            if (error.response.status === 401) {
              this.errorMessage = 'Tu sesión ha expirado. Por favor inicia sesión nuevamente.';
              localStorage.removeItem('token');
              this.$router.push('/user/login');
            } else if (error.response.status === 403) {
              this.errorMessage = 'No tienes permiso para editar este animal.';
            } else if (error.response.status === 404) {
              this.errorMessage = 'Animal no encontrado.';
            } else {
              this.errorMessage = error.response.data.message || 'Error al actualizar el animal.';
            }
          } else {
            this.errorMessage = 'Error de conexión. Por favor intenta nuevamente.';
          }
        } finally {
          this.isSubmitting = false;
        }
      }
    }
  };
  </script>
  <style scoped>
.animal-form {
  max-width: 800px;
  margin: 0 auto;
  padding: 1.5rem;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #2c3e50;
  font-size: 0.95rem;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: #f9f9f9;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.2);
  background-color: #ffffff;
}

.form-select {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1em;
}

.form-textarea {
  min-height: 120px;
  resize: vertical;
}

.file-upload {
  margin-top: 0.5rem;
}

.file-upload-label {
  display: inline-block;
  cursor: pointer;
}

.file-upload-button {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: #4a90e2;
  color: white;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.file-upload-button:hover {
  background-color: #3a7bc8;
}

.file-upload-input {
  display: none;
}

.file-upload-text {
  display: block;
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: #7f8c8d;
}

.image-previews {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.preview-item {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.preview-image {
  width: 100%;
  height: 120px;
  object-fit: cover;
  display: block;
}

.preview-remove {
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  width: 24px;
  height: 24px;
  background-color: rgba(255, 107, 107, 0.9);
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 1rem;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.preview-remove:hover {
  background-color: #ff5252;
  transform: scale(1.1);
}

.form-actions {
  margin-top: 2rem;
  text-align: center;
}

.submit-button {
  padding: 0.875rem 2rem;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  max-width: 300px;
}

.submit-button:hover {
  background-color: #3a7bc8;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
}

.submit-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.alert-message {
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1.5rem;
  font-weight: 500;
  text-align: center;
}

.alert-message.error {
  background-color: #ffebee;
  color: #d32f2f;
  border: 1px solid #ef9a9a;
}

.alert-message.success {
  background-color: #e8f5e9;
  color: #2e7d32;
  border: 1px solid #a5d6a7;
}

@media (max-width: 768px) {
  .animal-form {
    padding: 1rem;
  }
  
  .form-group {
    margin-bottom: 1.25rem;
  }
  
  .submit-button {
    max-width: 100%;
  }
}
</style>
<style scoped>
.form {
  max-width: 600px;
  margin: auto;
  padding: 20px;
}

input, textarea, select {
  width: 100%;
  padding: 12px 14px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 12px;
  font-size: 14px;
  box-sizing: border-box;
  transition: border 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

input:focus,
textarea:focus,
select:focus {
  border-color: #42b883;
  box-shadow: 0 0 4px rgba(76, 175, 80, 0.5);
  outline: none;
}

button {
  padding: 12px;
  background-color: #42b883;
  color: white;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 12px;
  width: 100%;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

button:hover {
  background-color: #45a049;
}

p {
  text-align: center;
  margin-top: 10px;
  font-weight: bold;
}

.file-upload-group {
  margin-bottom: 15px;
}

.file-upload-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 6px;
  color: #444;
}

.file-input {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #ccc;
  border-radius: 12px;
  font-size: 14px;
  background-color: #fff;
  cursor: pointer;
  transition: border 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.file-input:focus {
  border-color: #4caf50;
  box-shadow: 0 0 4px rgba(76, 175, 80, 0.5);
  outline: none;
}

</style>