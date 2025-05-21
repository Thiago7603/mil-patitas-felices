const express = require('express');
const router = express.Router();
const { getUserNotifications, deleteNotification } = require('../Controllers/notificationsController');
const authenticateMiddleware = require('../middleware/authMiddleware');

// Definir ruta NOTIFICACIONES
router.get('/notifications', authenticateMiddleware, getUserNotifications);
router.delete('/notifications/:id', authenticateMiddleware, deleteNotification);


module.exports = router;
