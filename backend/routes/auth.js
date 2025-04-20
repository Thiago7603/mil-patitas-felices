// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../config/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();
const userController = require('../Controllers/userController');

// Configuración del transportador de correo
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

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

  // Validación básica
  if (!email || !password) {
    return res.status(400).json({ 
      success: false,
      message: 'Email y contraseña son requeridos' 
    });
  }

  try {
    // 1. Buscar usuario
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'Usuario no encontrado' 
      });
    }

    // 2. Verificar contraseña
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ 
        success: false,
        message: 'Credenciales inválidas' // Mensaje genérico por seguridad
      });
    }

    // 3. Generar token con más información relevante
    const tokenPayload = {
      id: user.id,          // Usar 'id' en lugar de 'userId' para consistencia
      email: user.email,
      role: user.role,      // Añadir el rol para autorización
      name: user.name       // Información útil para el frontend
    };

    const token = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET || 'secreto', 
      { expiresIn: '1h' }
    );

    // 4. Responder con datos relevantes
    res.status(200).json({
      success: true,
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        // Otros datos que necesites en el frontend
      }
    });

  } catch (err) {
    console.error('Error en /login:', err);
    res.status(500).json({ 
      success: false,
      message: 'Error en el servidor al procesar la solicitud' 
    });
  }
});


// Get UserProfile
router.get('/profile/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const result = await pool.query(
      'SELECT id, name, email, profile_image, address, phone FROM users WHERE id = $1',
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
router.put('/profile/:id', upload.single('image'), async (req, res) => {
  const userId = req.params.id;
  const { name, email, phone, address } = req.body;
  const newImage = req.file ? req.file.filename : null;

  try {
    // Obtener la imagen anterior del usuario
    const userResult = await pool.query('SELECT profile_image FROM users WHERE id = $1', [userId]);
    const oldImage = userResult.rows[0]?.profile_image;
    console.log('Imagen anterior del usuario:', oldImage);


    // Actualizar la base de datos con la nueva información
    const updateResult = await pool.query(
      `UPDATE users 
       SET name = $1, email = $2, phone = $3, address = $4, profile_image = COALESCE($5, profile_image)
       WHERE id = $6
       RETURNING *`,
      [name, email, phone, address, newImage, userId]
    );

    const testFile = path.join(__dirname, 'uploads', 'user_1744963113454.jpeg');

    fs.unlink(testFile, (err) => {
      if (err) {
        console.error('No se pudo eliminar:', err);
      } else {
        console.log('Imagen eliminada correctamente');
      }
    });
    // Eliminar la imagen anterior si se subió una nueva
    //if (fs.existsSync(imagePath)) {
    //  fs.unlink(imagePath, (err) => {
    //    if (err) {
    //      console.error('Error al eliminar imagen anterior:', err);
    //    } else {
    //      console.log('Imagen anterior eliminada:', oldImage);
    //    }
    //  });
    //} else {
    //  console.log('Imagen anterior no existe físicamente:', imagePath);
    //}

    res.json({ message: 'Perfil actualizado', user: updateResult.rows[0] });
  } catch (err) {
    console.error('Error al actualizar perfil:', err);
    res.status(500).json({ message: 'Error del servidor' });
  }
});

router.post('/forgot-password', userController.sendResetCode);
router.post('/reset-password', userController.resetPassword);

// Enviar código de recuperación
//router.post('/profile/:id/send-reset-code', async (req, res) => {
//  const userId = req.params.id;

//  try {
//    const result = await pool.query('SELECT email FROM users WHERE id = $1', [userId]);
//    const user = result.rows[0];

 //   if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

//    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6 dígitos

//    await pool.query(
//      'UPDATE users SET reset_code = $1, reset_code_expire = NOW() + interval \'10 minutes\' WHERE id = $2',
//      [code, userId]
//    );

//    await transporter.sendMail({
//      from: process.env.EMAIL_USER,
//      to: user.email,
//      subject: 'Código para restablecer contraseña',
//      html: `<p>Tu código es: <b>${code}</b>. Tiene una validez de 10 minutos.</p>`
//    });

//    res.json({ message: 'Código enviado por correo' });
//  } catch (err) {
//    console.error('Error al enviar código:', err);
  //  res.status(500).json({ message: 'Error del servidor' });
 // }
//});

// Confirmar código y cambiar contraseña
//router.put('/profile/:id/reset-password', async (req, res) => {
//  const userId = req.params.id;
 // const { code, newPassword } = req.body;

//  try {
//    const result = await pool.query('SELECT reset_code, reset_code_expire FROM users WHERE id = $1', [userId]);
//    const user = result.rows[0];

//    if (!user || user.reset_code !== code) {
//      return res.status(400).json({ message: 'Código inválido' });
//    }

//    if (new Date(user.reset_code_expire) < new Date()) {
//      return res.status(400).json({ message: 'Código expirado' });
//    }

//    const hashed = await bcrypt.hash(newPassword, 10);
//    await pool.query(
//      'UPDATE users SET password = $1, reset_code = NULL, reset_code_expire = NULL WHERE id = $2',
//      [hashed, userId]
 //   );

//    res.json({ message: 'Contraseña actualizada correctamente' });
//  } catch (err) {
//    console.error('Error al restablecer contraseña:', err);
//    res.status(500).json({ message: 'Error del servidor' });
//  }
//});

// Change Password
//router.put('/profile/:id/password', async (req, res) => {
//  const userId = req.params.id;
//  const { currentPassword, newPassword } = req.body;

//  try {
//    const result = await pool.query('SELECT password FROM users WHERE id = $1', [userId]);
//    const user = result.rows[0];

//    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

//    const valid = await bcrypt.compare(currentPassword, user.password);
//    if (!valid) return res.status(400).json({ message: 'Contraseña actual incorrecta' });

 //   const hashed = await bcrypt.hash(newPassword, 10);
 //   await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashed, userId]);

 //   res.json({ message: 'Contraseña actualizada' });
 // } catch (err) {
 //   console.error('Error al cambiar contraseña:', err);
 //   res.status(500).json({ message: 'Error del servidor' });
 // }
//});

module.exports = router;
