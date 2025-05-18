const express = require('express');
const router = express.Router();
const { getRequestsByRefugio, updateRequestStatus } = require('../Controllers/requestController');
const authMiddleware = require('../middleware/authMiddleware');

// Obtener solicitudes de adopción por refugio y estado
router.get('/', authMiddleware, getRequestsByRefugio);

// Cambiar estado de la solicitud (aceptar o rechazar)
router.put('/:requestId', authMiddleware, updateRequestStatus);

module.exports = router;
