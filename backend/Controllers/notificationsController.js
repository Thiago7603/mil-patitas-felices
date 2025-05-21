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

const deleteNotification = async (req, res) => {
  const notificationId = req.params.id;
  const userId = req.user.id;

  console.log('→ DELETE notification ID:', notificationId);
  console.log('→ User ID from token:', userId);

  try {
    // Verificar que la notificación pertenece al usuario
    const check = await pool.query(
      'SELECT id FROM notifications WHERE id = $1 AND user_id = $2',
      [notificationId, userId]
    );

    if (check.rowCount === 0) {
      console.log('❌ No se encontró la notificación o no pertenece al usuario');
      return res.status(404).json({ error: 'Notificación no encontrada o no autorizada' });
    }

    await pool.query('DELETE FROM notifications WHERE id = $1', [notificationId]);
    res.json({ message: 'Notificación eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar notificación:', error);
    res.status(500).json({ error: 'Error al eliminar notificación' });
  }
};


module.exports = { getUserNotifications, deleteNotification };

