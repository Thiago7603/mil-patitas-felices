const pool = require('../config/db');

// Obtener favoritos de un usuario
const getFavoritesByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(
      `SELECT a.*, 
       (SELECT ARRAY(
          SELECT image_url FROM animal_images WHERE animal_id = a.id
       )) AS images
       FROM favorites f
       INNER JOIN animals a ON f.animal_id = a.id
       WHERE f.user_id = $1`,
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error getting favorites:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Agregar a favoritos
const addFavorite = async (req, res) => {
  const { userId, animalId } = req.body;
  await pool.query(`
    INSERT INTO favorites (user_id, animal_id)
    VALUES ($1, $2) ON CONFLICT DO NOTHING
  `, [userId, animalId]);

  res.status(201).json({ message: 'Animal añadido a favoritos' });
};

// Eliminar de favoritos
const removeFavorite = async (req, res) => {
  const { userId, animalId } = req.body;
  await pool.query(`
    DELETE FROM favorites WHERE user_id = $1 AND animal_id = $2
  `, [userId, animalId]);

  res.json({ message: 'Animal eliminado de favoritos' });
};

module.exports = { getFavoritesByUser, addFavorite, removeFavorite }