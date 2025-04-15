// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../config/db');
const multer = require('multer');
const path = require('path');



// Configuración de multer para subida de imágenes
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, `user_${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });

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


// UserProfile
router.post('/profile', async (req, res) => {
  const { userId } = req.body;
//router.get('/:id', async (req, res) => {
  //const userId = req.params.id;

  try {
    const result = await pool.query(
      'SELECT id, name, email, image, address, phone FROM users WHERE id = $1',
      [userId]
    );
    const user = result.rows[0];
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    res.json(user);
  } catch (err) {
    console.error('Error al obtener perfil:', err);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Update UserProfile
router.put('/:id', upload.single('image'), async (req, res) => {
  const userId = req.params.id;
  const { name, email, address, phone } = req.body;
  const image = req.file ? req.file.filename : null;

  try {
    const result = await pool.query(
      `UPDATE users 
       SET name = $1, email = $2, address = $3, phone = $4, image = COALESCE($5, image)
       WHERE id = $6
       RETURNING id, name, email, address, phone, image`,
      [name, email, address, phone, image, userId]
    );

    res.json({ message: 'Perfil actualizado', user: result.rows[0] });
  } catch (err) {
    console.error('Error al actualizar perfil:', err);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// Change Password
router.put('/:id/password', async (req, res) => {
  const userId = req.params.id;
  const { currentPassword, newPassword } = req.body;

  try {
    const result = await pool.query('SELECT password FROM users WHERE id = $1', [userId]);
    const user = result.rows[0];

    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) return res.status(400).json({ message: 'Contraseña actual incorrecta' });

    const hashed = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashed, userId]);

    res.json({ message: 'Contraseña actualizada' });
  } catch (err) {
    console.error('Error al cambiar contraseña:', err);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

module.exports = router;
