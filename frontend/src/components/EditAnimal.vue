<template>
  <form @submit.prevent="submitForm" enctype="multipart/form-data">
    <div class="form-group">
      <label>Nombre:</label>
      <input v-model="form.name" required />
    </div>
    <div class="form-group">
      <label>Especie:</label>
      <input v-model="form.species" required />
    </div>
    <div class="form-group">
      <label>Género:</label>
      <select v-model="form.gender" required>
        <option value="Macho">Macho</option>
        <option value="Hembra">Hembra</option>
      </select>
    </div>
    <div class="form-group">
      <label>Edad:</label>
      <input v-model.number="form.age" type="number" min="0" required />
    </div>
    <div class="form-group">
      <label>Tamaño:</label>
      <select v-model="form.size" required>
        <option value="Pequeño">Pequeño</option>
        <option value="Mediano">Mediano</option>
        <option value="Grande">Grande</option>
      </select>
    </div>
    <div class="form-group">
      <label>Salud:</label>
      <textarea v-model="form.health_status" required></textarea>
    </div>
    <div class="form-group">
      <label>Historia:</label>
      <textarea v-model="form.story" required></textarea>
    </div>
    <div class="form-group">
      <label>Requisitos de adopción:</label>
      <textarea v-model="form.adoption_requirements" required></textarea>
    </div>
    <div class="form-group">
      <label>Ubicación:</label>
      <input v-model="form.location" required />
    </div>

    <div class="form-group">
      <label>Imágenes:</label>
      <label class="clean-file-button">
        <input 
          type="file" 
          multiple 
          accept="image/*" 
          @change="handleImageChange"
          ref="fileInput"
          :key="fileInputKey"
        />
        <span>Seleccionar la imagen</span>
      </label>
      <span v-if="images.length > 0" class="file-counter">{{ images.length }} archivo(s)</span>
    </div>

    <div v-if="imagePreviews.length" class="image-previews">
      <div v-for="(preview, index) in imagePreviews" :key="index" class="preview-item">
        <img :src="preview" alt="Vista previa de imagen" />
        <button type="button" class="remove-image-button" @click="removeImage(index)">
          Eliminar
        </button>
      </div>
    </div>

    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

    <button type="submit" :disabled="isSubmitting">
      {{ isSubmitting ? 'Actualizando...' : 'Actualizar' }}
    </button>

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
      successMessage: '',
      fileInputKey: Date.now()
    };
  },
  mounted() {
    this.fetchAnimal();
    console.log('ID del animal recibido:', this.animalId);
  },
  methods: {
    async fetchAnimal() {
      try {
        const response = await axios.get(`http://localhost:4000/api/animals/${this.animalId}`);
        this.form = response.data;
        if (response.data.images) {
          // Convertir las URLs de las imágenes existentes a vistas previas
          this.imagePreviews = response.data.images.map(img => 
            img.startsWith('http') ? img : `http://localhost:4000/uploads/${img}`
          );
        }
      } catch (error) {
        console.error('Error al cargar datos del animal:', error);
        this.errorMessage = 'Error al cargar los datos del animal';
      }
    },
    handleImageChange(event) {
      this.images = Array.from(event.target.files);
      this.imagePreviews = [];
      
      // Generar vistas previas
      this.images.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imagePreviews.push(e.target.result);
        };
        reader.readAsDataURL(file);
      });
    },
    removeImage(index) {
      this.images.splice(index, 1);
      this.imagePreviews.splice(index, 1);
      // Resetear el input file para permitir seleccionar la misma imagen otra vez
      this.fileInputKey = Date.now();
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
          `http://localhost:4000/api/animals/${this.animalId}`,
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
form {
  max-width: 600px;
  margin: auto;
  padding: 20px;
}

div {
  display: grid;
  align-items: center;
  margin-bottom: 15px;
}

label {
  width: 150px;
  margin-right: 15px;
  text-align: left;
  display: inline-block;
}

input, textarea, select {
  width: 100%;
  padding: 12px 14px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 12px;
  font-size: 14px;
  box-sizing: border-box;
}

/* El resto del CSS permanece exactamente igual */
button[type="submit"] {
  padding: 12px;
  background-color: #027441;
  color: white;
  border: none;
  border-radius: 12px;
  width: 100%;
  cursor: pointer;
}

.clean-file-button {
  display: inline-block;
  padding: 10px 15px;
  background: #f0f0f0;
  color: #333;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.clean-file-button:hover {
  background: #e0e0e0;
  border-color: #ccc;
}

.clean-file-button input[type="file"] {
  display: none;
}

.file-counter {
  margin-left: 10px;
  font-size: 0.9em;
  color: #666;
}

.image-previews {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
  margin-top: 15px;
}

.preview-item {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.preview-item img {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.remove-image-button {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  padding: 5px 10px;
  background-color: rgba(244, 67, 54, 0.9);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
}

.error-message {
  color: #f44336;
  font-size: 14px;
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
  background-color: #027441bc;
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

.image-previews {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
  overflow-x: auto;
}

.preview-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.preview-item {
  width: 300px;
  height: 300px;
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 5px;
}

.preview-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-image {
  width: 100%;
  height: 120px;
  object-fit: cover;
  display: block;
}

.remove-image-button {
  padding: 8px 12px;
  background-color: #f44336;
  color: white;
  font-size: 14px;
  font-weight: bold;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  width: 100px;
  box-sizing: border-box;
}

.remove-image-button:hover {
  background-color: #e53935;
}

.success-message {
  color: #4caf50;
  font-size: 14px;
}
</style>