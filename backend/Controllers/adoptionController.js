const pool = require('../config/db');

// Crear solicitud de adopción
exports.createAdoptionRequest = async (req, res) => {
  const { user_id, animal_id, message } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO adoption_requests (user_id, animal_id, message, status, created_at)
       VALUES ($1, $2, $3, 'en revisión', NOW()) RETURNING *`,
      [user_id, animal_id, message]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear la solicitud' });
  }
};

// Obtener todas las solicitudes (para refugio)
exports.getAllRequests = async (req, res) => {
  if (req.user.role !== 'refugio') {
    return res.status(403).json({ error: 'Solo refugios pueden ver las solicitudes' });
  }

  const refugioId = req.user.id;

  try {
    const result = await pool.query(
      `SELECT ar.*, u.name as user_name, a.name as animal_name
       FROM adoption_requests ar
       JOIN users u ON ar.user_id = u.id
       JOIN animals a ON ar.animal_id = a.id
       WHERE a.refugio_id = $1
       ORDER BY ar.created_at DESC`,
      [refugioId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los tickets' });
  }
};


// Actualizar estado de una solicitud
exports.updateRequestStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'aceptada' o 'rechazada'

  try {
    const result = await pool.query(
      'UPDATE adoption_requests SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el estado del ticket' });
  }
};
