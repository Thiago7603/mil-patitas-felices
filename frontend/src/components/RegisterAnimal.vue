<template>
  <form @submit.prevent="handleSubmit" enctype="multipart/form-data" class="form">
    <input v-model="form.name" type="text" placeholder="Nombre" required />
    <input v-model="form.species" type="text" placeholder="Especie" />
    <input v-model="form.gender" type="text" placeholder="Género" />
    <input v-model.number="form.age" type="number" placeholder="Edad" />
    <input v-model="form.size" type="text" placeholder="Tamaño" />
    <textarea v-model="form.health_status" placeholder="Estado de salud"></textarea>
    <textarea v-model="form.story" placeholder="Historia"></textarea>
    <textarea v-model="form.adoption_requirements" placeholder="Requisitos de adopción"></textarea>
    <input v-model="form.location" type="text" placeholder="Ubicación" />
    <input v-model.number="form.created_by" type="number" placeholder="ID del refugio" required />

    <div class="file-upload-group">
      <label for="imageUpload">📷 Imágenes (máx. 5):</label>
      <input id="imageUpload" class="file-input" type="file" multiple accept="image/*" @change="handleFileChange" />
    </div>


    <button type="submit">Registrar</button>
    <p>{{ message }}</p>
  </form>
</template>

<script>
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
        created_by: null
      },
      images: [],
      message: ''
    };
  },
  methods: {
    handleFileChange(event) {
      this.images = Array.from(event.target.files).slice(0, 5);
    },
    async handleSubmit() {
      const formData = new FormData();
      for (const key in this.form) {
        formData.append(key, this.form[key]);
      }
      this.images.forEach((image) => {
        formData.append('images', image);
      });

      try {
        const res = await fetch('http://localhost:4000/api/animals/register', {
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

