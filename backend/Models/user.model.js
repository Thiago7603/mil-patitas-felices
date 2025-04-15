const pool = require('../config/db');

const getUserById = async (id) => {
  const result = await pool.query('SELECT id, name, email, image FROM users WHERE id = $1', [id]);
  return result.rows[0];
};

const updateUser = async (id, name, email, image) => {
  const result = await pool.query(
    'UPDATE users SET name = $1, email = $2, image = $3 WHERE id = $4 RETURNING *',
    [name, email, image, id]
  );
  return result.rows[0];
};

const updatePassword = async (id, hashedPassword) => {
  await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, id]);
};

const getUserPassword = async (id) => {
  const result = await pool.query('SELECT password FROM users WHERE id = $1', [id]);
  return result.rows[0]?.password;
};

module.exports = {
  getUserById,
  updateUser,
  updatePassword,
  getUserPassword
};
