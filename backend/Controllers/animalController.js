const pool = require('../config/db'); // Asegúrate de tener tu conexión a PostgreSQL aquí
const multer = require('multer');
const path = require('path');

// Configuración de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `animal_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen'), false);
    }
  }
}).array('images', 5); // Máximo 5 imágenes

// Crear animal
const createAnimal = async (req, res) => {
  const {
    name, species, gender, age, size,
    health_status, story, adoption_requirements,
    location, created_by
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO animals (name, species, gender, age, size, health_status, story, adoption_requirements, location, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
      [name, species, gender, age, size, health_status, story, adoption_requirements, location, created_by]
    );

    const animalId = result.rows[0].id;

      // Guardar nombres de archivo en la base de datos
      if (req.files && req.files.length > 0) {
        const imageNames = req.files.map(file => file.filename);
        
        for (const fileName of imageNames) {
          await pool.query(
            `INSERT INTO animal_images (animal_id, image_url) VALUES ($1, $2)`,
            [animalId, fileName] // Solo el nombre del archivo
          );
        }
      }

      res.status(201).json({ 
        success: true,
        animalId,
        images: req.files?.map(f => f.filename) || [] 
      });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al registrar el animal' });
  }
};

// Obtener un animal por su ID
//const getAnimalById = async (req, res) => {
//    const { id } = req.params;
  
//    try {
//      const animalResult = await pool.query('SELECT * FROM animals WHERE id = $1', [id]);
//      if (animalResult.rows.length === 0) {
//        return res.status(404).json({ error: 'Animal no encontrado' });
//      }
  
//      const imagesResult = await pool.query('SELECT image_url FROM animal_images WHERE animal_id = $1', [id]);
  
//      res.json({
//        ...animalResult.rows[0],
//        images: imagesResult.rows.map(img => img.image_url)
//      });
//    } catch (err) {
//      console.error('Error al obtener animal por ID:', err);
//      res.status(500).json({ error: 'Error al obtener animal' });
//    }
//  };

  // Controlador para obtener animales POR REFUGIO (usando created_by)
  const getAnimalsByRefugio = async (req, res) => {
    const refugioId = req.params.id; // ID del refugio (usuario creador)

    try {
      // 1. Obtener todos los animales del refugio
      const animalsResult = await pool.query(
        `SELECT a.*, 
        (SELECT ARRAY(
          SELECT image_url FROM animal_images WHERE animal_id = a.id
        )) AS images
        FROM animals a
        WHERE a.created_by = $1`,
        [refugioId]
      );

      // 2. Siempre devolver un array (aunque esté vacío)
      res.status(200).json(animalsResult.rows);

    } catch (error) {
      console.error('Error:', error);
      res.status(500).json([]); // Devuelve array vacío en caso de error
    }
  };
  
    // Editar animal
    const editAnimal = async (req, res) => {
        const { name, species, gender, age, size, health_status, story, adoption_requirements, location } = req.body;
        const animalId = req.params.id;
        const userId = req.user.id;
    
        try {
        // Primero verificar si el animal existe
        const animalCheck = await pool.query('SELECT * FROM animals WHERE id = $1', [animalId]);
        if (animalCheck.rowCount === 0) {
            return res.status(404).json({ message: 'Animal no encontrado' });
        }
    
        // Verificar que el usuario sea el creador del animal o admin
        if (animalCheck.rows[0].created_by !== userId && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'No autorizado para editar este animal' });
        }
    
        // Actualizar el animal
        const updateAnimal = await pool.query(
            `UPDATE animals SET name = $1, species = $2, gender = $3, age = $4, size = $5, 
            health_status = $6, story = $7, adoption_requirements = $8, location = $9
            WHERE id = $10 RETURNING *`,
            [name, species, gender, age, size, health_status, story, adoption_requirements, location, animalId]
        );
    
        res.status(200).json({ 
            message: 'Publicación de animal actualizada exitosamente.', 
            animal: updateAnimal.rows[0] 
        });
        } catch (error) {
        console.error('Error en editAnimal:', error);
        res.status(500).json({ message: 'Error al actualizar el animal.' });
        }
    };

// Eliminar animal
const deleteAnimal = async (req, res) => {
    const { id } = req.params;
  
    try {
      await pool.query('BEGIN');
  
      // 1. Verificar si el animal existe (única verificación necesaria)
      const animal = await pool.query('SELECT id FROM animals WHERE id = $1', [id]);
      if (animal.rows.length === 0) {
        await pool.query('ROLLBACK');
        return res.status(404).json({ 
          success: false,
          message: 'Animal no encontrado' 
        });
      }
  
      // 2. Eliminar imágenes asociadas
      await pool.query('DELETE FROM animal_images WHERE animal_id = $1', [id]);
      
      // 3. Eliminar el animal
      await pool.query('DELETE FROM animals WHERE id = $1', [id]);
      
      await pool.query('COMMIT');
  
      res.status(200).json({
        success: true,
        message: 'Animal eliminado exitosamente'
      });
  
    } catch (error) {
      await pool.query('ROLLBACK');
      console.error('Error al eliminar animal:', error);
      res.status(500).json({
        success: false,
        message: 'Error del servidor al eliminar'
      });
    }
  };

module.exports = { createAnimal, editAnimal, deleteAnimal, getAnimalsByRefugio };

