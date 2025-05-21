const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { createAnimal, editAnimal, deleteAnimal } = require('../Controllers/animalController');
const authMiddleware = require('../middleware/authMiddleware');
const { getAllAnimals, getAnimalsByRefugio, getAnimalById } = require('../Controllers/animalController');

// Configuración para subir imágenes
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Asegúrate que esta carpeta exista
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

//Ruta para obtener los animales de un refugio
router.get('/refugio/:id', authMiddleware,getAnimalsByRefugio);

//Ruta para obtener los animales de todos los refugios en la vista de adopcion
router.get('/adopt', authMiddleware, getAllAnimals);

// Ruta para registrar nuevo animal
router.post('/register/:id', upload.array('images', 5), createAnimal);

// Ruta para editar animal
router.put('/:id', authMiddleware, upload.array('images', 5), editAnimal);  // Aquí subimos imágenes, si es necesario

// Ruta para eliminar animal
router.delete('/:id', authMiddleware, deleteAnimal);

router.get('/:id', getAnimalById);

module.exports = router;