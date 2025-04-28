const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Autenticación requerida' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto');
    req.user = {
      id: decoded.id,          // Asegúrate de que el payload del JWT incluya esto
      role: decoded.role,      // Ej: 'refugio' o 'adoptante'
      email: decoded.email     // Opcional
    };
    next();
  } catch (err) {
    console.error('Error al verificar token:', err);
    return res.status(401).json({ 
      message: 'Token inválido o expirado',
      error: err.message 
    });
  }
};

module.exports = authMiddleware;
