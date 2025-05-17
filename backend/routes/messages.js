const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Obtener todos los mensajes donde el usuario participa
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM messages
       WHERE sender_id = $1 OR receiver_id = $1
       ORDER BY sent_at ASC`,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener mensajes:', err);
    res.status(500).json({ error: 'Error al obtener mensajes' });
  }
});

// Enviar un mensaje
router.post('/', async (req, res) => {
  const { sender_id, receiver_id, content } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO messages (sender_id, receiver_id, content)
       VALUES ($1, $2, $3) RETURNING *`,
      [sender_id, receiver_id, content]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error al enviar mensaje:', err);
    res.status(500).json({ error: 'Error al enviar mensaje' });
  }
});

module.exports = router;
