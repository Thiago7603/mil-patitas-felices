const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log('Authorization header:', authHeader);
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('No hay token o no comienza con Bearer');
    return res.status(401).json({ message: 'Autenticación requerida' });
  }

  const token = authHeader.split(' ')[1];
  console.log('Token extraído:', token);

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
