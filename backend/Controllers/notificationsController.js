const pool = require('../config/db'); // Ajusta la ruta según la ubicación real

const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id; // Aquí asumes que ya tienes el usuario autenticado

    const result = await pool.query(`
      SELECT id, message, read, created_at 
      FROM notifications 
      WHERE user_id = $1
      ORDER BY created_at DESC
    `, [userId]);

    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener notificaciones:', error);
    res.status(500).json({ error: 'Error al obtener notificaciones' });
  }
};

module.exports = { getUserNotifications };
