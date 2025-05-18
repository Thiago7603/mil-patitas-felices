const express = require('express');
const router = express.Router();
const { getUserNotifications } = require('../Controllers/notificationsController');
const authenticateMiddleware = require('../middleware/authMiddleware');

// Definir ruta NOTIFICACIONES
router.get('/notifications', authenticateMiddleware, getUserNotifications);

module.exports = router;
