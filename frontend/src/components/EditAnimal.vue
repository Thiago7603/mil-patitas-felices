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
  