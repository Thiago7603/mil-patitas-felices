const pool = require('../config/db');

const getUserById = async (id) => {
  const result = await pool.query('SELECT id, name, email, address, profile_image, phone FROM users WHERE id = $1', [id]);
  return result.rows[0];
};

const updateUser = async (id, name, email, address, phone, image) => {
  const result = await pool.query(
    'UPDATE users SET name = $1, email = $2, phone, = $3, addres = $4, profile_image = $5 WHERE id = $6 RETURNING *',
    [name, email, address, phone, image, id]
  );
  return result.rows[0];
};

const getUserByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};

const updatePassword = async (id, newHash) => {
  await pool.query('UPDATE users SET password = $1 WHERE id = $2', [newHash, id]);
};

module.exports = {
  getUserById,
  updateUser,
  updatePassword,
  getUserByEmail
};
