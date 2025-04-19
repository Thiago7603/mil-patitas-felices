const bcrypt = require('bcryptjs');
const userModel = require('../Models/user.model');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const pool = require('../config/db');
const dotenv = require('dotenv');
dotenv.config(); // ⬅️ Carga las variables de .env


const resetTokens = new Map(); // memoria temporal para guardar códigos

const getProfile = async (req, res) => {
  const userId = req.params.id; 
  try {
    const user = await userModel.getUserById(userId);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener el perfil' });
  }
};

const updateProfile = async (req, res) => {
  const userId = req.params.id;
  const { name, email, phone, address } = req.body;
  const image = req.file ? req.file.filename : null;

  try {
    const updated = await userModel.updateUser(userId, name, email, phone, address, image);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar el perfil' });
  }
};

const sendResetCode = async (req, res) => {
  const { email } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const code = Math.floor(100000 + Math.random() * 900000);
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

    await pool.query(
      'UPDATE users SET reset_code = $1, reset_expires = $2 WHERE email = $3',
      [code.toString(), expires, email]
    );

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // generado desde Google App Passwords
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Código de recuperación',
      text: `Tu código de verificación es: ${code}`
    });

    res.json({ message: 'Código enviado al correo' });
  } catch (err) {
    console.error('Error al enviar código:', err);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

const resetPassword = async (req, res) => {
  const { email, code, newPassword } = req.body;

  try {
    // Verificamos si el email y código coinciden
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND reset_code = $2',
      [email, code]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Código inválido o expirado' });
    }
    const hashed = await bcrypt.hash(newPassword, 10);

    await pool.query(
      'UPDATE users SET password = $1, reset_code = NULL, reset_expires = NULL WHERE email = $2',
      [hashed, email]
    );

    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (err) {
    console.error('Error al restablecer contraseña:', err);
    res.status(500).json({ message: 'Error al restablecer la contraseña' });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  sendResetCode,
  resetPassword,
};
