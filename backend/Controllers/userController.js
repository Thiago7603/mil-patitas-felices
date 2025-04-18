const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');

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

const changePassword = async (req, res) => {
  const userId = req.params.id;
  const { newPassword } = req.body;

  try {
    const hashed = await userModel.getUserPassword(userId);
    //const valid = await bcrypt.compare(currentPassword, hashed);

    //if (!valid) return res.status(400).json({ error: 'Contraseña actual incorrecta' });

    const newHash = await bcrypt.hash(newPassword, 10);
    await userModel.updatePassword(userId, newHash);

    res.json({ message: 'Contraseña actualizada' });
  } catch (err) {
    res.status(500).json({ error: 'Error al cambiar la contraseña' });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword
};
