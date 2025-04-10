// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../config/db');

// Registro de usuario
router.post('/register', async (req, res) => {
  const { name, email, password, address, phone, role } = req.body;

  try {
    const existing = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0)
      return res.status(400).json({ message: 'El correo ya está registrado' });

    const hashed = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name, email, password, address, phone, role)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, name, email, role`,
      [name, email, hashed, address, phone, role]
    );

    res.status(201).json({ message: 'Usuario registrado', user: result.rows[0] });
  } catch (err) {
    console.error('Error en /register:', err);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Contraseña incorrecta' });

    res.status(200).json({
      message: 'Login exitoso',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Error en /login:', err);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

module.exports = router;
