const pool = require('../config/db'); // o tu instancia de conexión

// Obtener solicitudes de adopción en revisión para un refugio
const getRequestsByRefugio = async (req, res) => {
  const refugioId = req.user.id; // ← Obtener directamente del token
  console.log('Refugio autenticado ID:', refugioId);

  try {
    const { rows } = await pool.query(`
      SELECT 
        r.id, 
        r.animal_id, 
        a.name AS animal_name, 
        u.name AS adoptante_name, 
        r.status
      FROM adoption_requests r
      JOIN animals a ON r.animal_id = a.id
      JOIN users u ON r.user_id = u.id
      WHERE a.created_by = $1 AND r.status = 'en revisión'
    `, [refugioId]);
    console.log('Solicitudes encontradas:', rows.length);

    res.json(rows);
  } catch (error) {
    console.error('Error al obtener solicitudes:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};




// Cambiar el estado de una solicitud (aceptar o rechazar)
const updateRequestStatus = async (req, res) => {
  const requestId = req.params.requestId;
  const { status } = req.body;

  try {
    // 1. Actualiza el estado de la solicitud
    await pool.query(`
      UPDATE adoption_requests SET status = $1 WHERE id = $2
    `, [status, requestId]);

    // 2. Obtener animal_id y user_id para luego crear notificaciones
    const requestData = await pool.query(`
      SELECT animal_id, user_id FROM adoption_requests WHERE id = $1
    `, [requestId]);

    const animalId = requestData.rows[0]?.animal_id;
    const userId = requestData.rows[0]?.user_id;

    // 3. Si se acepta, marca el animal como adoptado y rechaza otras solicitudes
    if (status === 'aceptada' && animalId) {
      await pool.query(`
        UPDATE animals SET adopted = true WHERE id = $1
      `, [animalId]);

      // Rechazar otras solicitudes para el mismo animal (excepto la aceptada)
      await pool.query(`
        UPDATE adoption_requests SET status = 'rechazada'
        WHERE animal_id = $1 AND id <> $2
      `, [animalId, requestId]);

      // Crear notificación para el solicitante aceptado
      if (userId) {
        await pool.query(`
          INSERT INTO notifications (user_id, message, animal_id) VALUES ($1, $2, $3)
        `, [userId, 'Tu solicitud de adopción fue aceptada. ¡Felicitaciones!', animalId]);
      }

      // Crear notificaciones para usuarios cuyas solicitudes fueron rechazadas automáticamente
      const rejectedRequests = await pool.query(`
        SELECT user_id FROM adoption_requests WHERE animal_id = $1 AND id <> $2
      `, [animalId, requestId]);

      for (const row of rejectedRequests.rows) {
        await pool.query(`
          INSERT INTO notifications (user_id, message) VALUES ($1, $2)
        `, [row.user_id, 'Tu solicitud de adopción fue rechazada.']);
      }

    } else if (status === 'rechazada' && userId) {
      // Si la solicitud fue rechazada manualmente, crear notificación para ese usuario
      await pool.query(`
        INSERT INTO notifications (user_id, message) VALUES ($1, $2)
      `, [userId, 'Tu solicitud de adopción fue rechazada.']);
    }

    res.json({ message: `Solicitud ${status} correctamente` });
  } catch (error) {
    console.error('Error al actualizar solicitud:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};





module.exports = {
  getRequestsByRefugio,
  updateRequestStatus
};
