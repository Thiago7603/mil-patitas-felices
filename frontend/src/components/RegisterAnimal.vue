<template>
  <form @submit.prevent="handleSubmit" enctype="multipart/form-data">
    <div>
      <label>Nombre:</label>
      <input v-model="form.name" type="text" :class="{ 'input-error': errors.name }" />
      <p v-if="errors.name" class="error-text">{{ errors.name }}</p>
    </div>
    <div>
      <label>Especie:</label>
      <select v-model="form.species" :class="{ 'input-error': errors.species }">
          <option value="perro">Perro</option>
          <option value="gato">Gato</option>
          <option value="otro">Otro</option>
      </select>
      <p v-if="errors.species" class="error-text">{{ errors.species }}</p>
    </div>
    <div>
      <label>Género:</label>
      <select v-model="form.gender" :class="{ 'input-error': errors.gender }">
        <option value="Macho">Macho</option>
        <option value="Hembra">Hembra</option>
      </select>
      <p v-if="errors.gender" class="error-text">{{ errors.gender }}</p>
    </div>
    <div>
      <label>Edad:</label>
      <input v-model="form.age" type="text" :class="{ 'input-error': errors.age }" />
      <p v-if="errors.age" class="error-text">{{ errors.age }}</p>
    </div>
    <div>
      <label>Tamaño:</label>
      <select v-model="form.size" :class="{ 'input-error': errors.size }">
        <option value="Pequeño">Pequeño</option>
        <option value="Mediano">Mediano</option>
        <option value="Grande">Grande</option>
      </select>
      <p v-if="errors.size" class="error-text">{{ errors.size }}</p>
    </div>
    <div>
      <label>Salud:</label>
      <textarea v-model="form.health_status"  :class="{ 'input-error': errors.health_status }"></textarea>
    </div>
    <div>
      <label>Historia:</label>
      <textarea v-model="form.story" :class="{ 'input-error': errors.story }"></textarea>
      <p v-if="errors.story" class="error-text">{{ errors.story }}</p>
    </div>
    <div>
      <label>Requisitos de adopción:</label>
      <textarea v-model="form.adoption_requirements" :class="{ 'input-error': errors.adoption_requirements }"></textarea>
      <p v-if="errors.adoption_requirements" class="error-text">{{ errors.adoption_requirements }}</p>
    </div>
    <div>
      <label>Ubicación:</label>
      <select v-model="selectedLocationOption" :class="{ 'input-error': errors.locationOption }" >
        <option value="Cali - Colombia">Cali - Colombia</option>
        <option value="Otro">Otro</option>
      </select>
      <p v-if="errors.locationOption" class="error-text">{{ errors.locationOption }}</p>  
    </div>

    <div v-if="selectedLocationOption === 'Otro'">
      <label>Escribe la ciudad:</label>
      <input v-model="form.location" type="text" :class="{ 'input-error': errors.location }" />
      <p v-if="errors.location" class="error-text">{{ errors.location }}</p>
    </div>
    <p>ID del refugio asignado: {{ form.created_by }}</p>
    <div>
      <label>Imágenes:</label>
      <label class="clean-file-button">
        <input 
          type="file" 
          multiple 
          accept="image/*" 
          @change="handleFileChange"
          ref="fileInput"
          :class="{ 'input-error': errors.images }"
        />
        <span>Seleccionar la imagen</span>
      </label>
      <span v-if="images.length > 0" class="file-counter">{{ images.length }} archivo(s)</span>
      <p v-if="errors.images" class="error-text">{{ errors.images }}</p>
      <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>
      <!-- Vista previa de imágenes (se mantiene igual) -->
      <div v-if="imagePreviews.length" class="image-previews">
        <div v-for="(preview, index) in imagePreviews" :key="index" class="preview-item">
          <img :src="preview" alt="Vista previa de imagen" />
          <button type="button" class="remove-image-button" @click="removeImage(index)">
            Eliminar
          </button>
        </div>
      </div>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </div>

    <button type="submit">Registrar</button>
    <p>{{ message }}</p>
  </form>
</template>

<script>
import { ref } from 'vue'
export default {
  name: 'RegisterAnimalForm',
  data() {
    return {
      form: {
        name: '',
        species: '',
        gender: '',
        age: null,
        size: '',
        health_status: '',
        story: '',
        adoption_requirements: '',
        location: '',
        created_by: null,
      },
      selectedLocationOption: '',
      images: [],
      imagePreviews: [],
      message: '',
      errorMessage: '',
      errors: {},
      fileInput: ref(null),
    };
  },
  watch: {
    // Escucha cambios en selectedLocationOption
    selectedLocationOption(newVal) {
      if (newVal === 'Cali - Colombia') {
        this.form.location = 'Cali - Colombia';
        this.errors.location = ''; // Limpiar error si había uno en el input de texto
      } else if (newVal === 'Otro') {
        this.form.location = ''; // Limpiar el campo de texto cuando se selecciona "Otro"
      } else {
        this.form.location = ''; // Limpiar si no se selecciona nada
      }
      this.errors.locationOption = ''; // Limpiar el error del select de opción de ubicación
    }
  },
  methods: {
      handleFileChange(event) {
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
      removeImage(index) {
        // Elimina la imagen del array de archivos
        this.images.splice(index, 1);
        // Elimina la vista previa
        this.imagePreviews.splice(index, 1);
        this.fileInputKey = Date.now();
    },
     validateForm() {
      this.errors = {}; // Limpiar errores anteriores
      let isValid = true;

      // Validar campos de texto y select
      const requiredFields = [
        'name', 'species', 'gender', 'age', 'size',
        'health_status', 'story', 'adoption_requirements'
      ];

      requiredFields.forEach(field => {
        // Para 'age', null se considera vacío. Para strings, un string vacío.
        if (this.form[field] === '' || this.form[field] === null) {
          this.errors[field] = `El campo ${field.replace(/_/g, ' ')} es obligatorio.`;
          isValid = false;
        }
      });

      // Validar edad específica (número positivo)
      if (this.form.age !== null && (isNaN(this.form.age) || this.form.age < 0)) {
        this.errors.age = 'La edad debe ser un número positivo.';
        isValid = false;
      }

      if (this.selectedLocationOption === '') {
        this.errors.locationOption = 'Debes seleccionar una opción de ubicación.';
        isValid = false;
      } else if (this.selectedLocationOption === 'Otro') {
        if (this.form.location === '') {
          this.errors.location = 'Por favor, escribe la ciudad.';
          isValid = false;
        }
      }
      // ----------------------------------------

      if (this.images.length === 0) {
        this.errors.images = 'Por favor, sube una imagen.';
        isValid = false;
      }
      return isValid;
    },
    async handleSubmit() {
      this.message = '';
      this.errorMessage = '';

      // 1. Ejecutar validación
      if (!this.validateForm()) {
        this.message = '❌ Por favor, completa todos los campos requeridos.';
        return; // Detener el envío si la validación falla
      }
      const formData = new FormData();
      for (const key in this.form) {
        formData.append(key, this.form[key]);
      }
      this.images.forEach((file) => {
        formData.append('images', file);
      });

      try {
        const refugioId = this.$route.params.id;
        this.form.created_by = Number(refugioId)
        console.log('refugio: ',refugioId)
        console.log('created_by:',this.form.created_by)
        const res = await fetch(`http://localhost:4000/api/animals/register/${refugioId}`, {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        if (res.ok) {
          this.message = `✅ Animal registrado con ID: ${data.animalId}`;
          this.resetForm();
          this.errors = {};
        } else {
          this.message = `❌ Error: ${data.error || 'No se pudo registrar'}`;
        }
      } catch (err) {
        this.message = '❌ Error en la conexión con el servidor';
      }
    },
    resetForm() {
      for (const key in this.form) {
        this.form[key] = key === 'age' || key === 'created_by' ? null : '';
      }
      this.images = [];
    }
  }
};
</script>

<style scoped>
.form {
  max-width: 600px;
  margin: auto;
  padding: 20px;
}

div {
  display:grid;
  align-items: center;
  margin-bottom: 15px;
}

label {
  width: 150px;
  margin-right: 15px;
  text-align: left;
}

input, textarea, select {
  flex-grow: 1;
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
  border-color: #027441;
  box-shadow: 0 0 4px #027441a5;
  outline: none;
}


button[type="submit"] {
  padding: 12px;
  background-color: #027441;
  color: white;
  border: none;
  border-radius: 12px;
  width: 100%;
  cursor: pointer;
}

/* Estilos para el botón de archivos */
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

/* Estilos para las vistas previas */
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

.input-error {
  border-color: #f44336 !important; /* Rojo para el borde del input con error */
  box-shadow: 0 0 4px rgba(244, 67, 54, 0.5) !important;
}

.error-text {
  color: #f44336;
  font-size: 0.85em;
  margin-top: 2px;
  margin-bottom: 5px;
  text-align: left;
  font-weight: bold;
}

.form-message {
  text-align: center;
  margin-top: 15px;
  font-weight: bold;
}

.form-message.error {
    color: #f44336;
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
  overflow: hidden; /* Recorta la imagen si excede el contenedor */
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

</style>