// adoptionRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { createAdoptionRequest } = require('../Controllers/adoptionController');

const adoptionController = require('../Controllers/adoptionController');


// POST para crear solicitud de adopción
router.post('/request', authMiddleware, createAdoptionRequest);
router.get('/requests', adoptionController.getAllRequests);
router.patch('/request/:id/status', adoptionController.updateRequestStatus);

module.exports = router;
