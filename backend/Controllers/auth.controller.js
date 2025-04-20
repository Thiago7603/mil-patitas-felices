const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { name, email, password, address, phone, role } = req.body;

  try {
    // 1. Verificar si el usuario ya existe
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // 2. Crear el nuevo usuario (deberías hashear la contraseña aquí)
    const newUser = await pool.query(
      `INSERT INTO users (name, email, password, address, phone, role) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, email, role`,
      [name, email, password, address, phone, role]
    );

    // 3. Generar el token JWT
    const token = jwt.sign(
      {
        id: newUser.rows[0].id,
        email: newUser.rows[0].email,
        role: newUser.rows[0].role
      },
      process.env.JWT_SECRET || 'secreto',
      { expiresIn: '1h' }
    );

    // 4. Responder con el token y datos del usuario
    res.status(201).json({
      message: 'Usuario registrado con éxito',
      token,
      user: {
        id: newUser.rows[0].id,
        name: newUser.rows[0].name,
        email: newUser.rows[0].email,
        role: newUser.rows[0].role
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
};