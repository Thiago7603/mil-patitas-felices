const pool = require('../config/db'); // Ajusta la ruta según la ubicación real

const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(`
      SELECT 
        n.id,
        n.message,
        n.read,
        n.created_at,
        a.id AS animal_id,
        a.name AS animal_name
      FROM notifications n
      LEFT JOIN animals a ON n.animal_id = a.id
      WHERE n.user_id = $1
      ORDER BY n.created_at DESC
    `, [userId]);

    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener notificaciones:', error);
    res.status(500).json({ error: 'Error al obtener notificaciones' });
  }
};




module.exports = { getUserNotifications };
