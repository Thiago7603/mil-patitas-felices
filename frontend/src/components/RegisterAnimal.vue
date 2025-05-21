<template>
  <form @submit.prevent="handleSubmit" enctype="multipart/form-data">
    <div>
      <label>Nombre:</label>
      <input v-model="form.name" type="text" required />
    </div>
    <div>
      <label>Especie:</label>
      <select v-model="form.gender">
          <option value="perro">Perro</option>
          <option value="gato">Gato</option>
          <option value="otro">Otro</option>
      </select>
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
      <input v-model="form.age" type="text" required />
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
      <input v-model="form.location" type="text" required />
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
          :key="fileInputKey"
        />
        <span>Seleccionar la imagen</span>
      </label>
      <span v-if="images.length > 0" class="file-counter">{{ images.length }} archivo(s)</span>
      
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
        fileInputKey: Date.now()
      },
      images: [],
      imagePreviews: [],
      message: '',
      errorMessage: '',
      fileInput: ref(null),
    };
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
    async handleSubmit() {
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