// 📁 backend/routes/asignacionRoutes.js
const express = require('express');
const router = express.Router();
const asignacionController = require('../controllers/asignacionController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

// ✅ GET /api/asignaciones/coordinadores
router.get('/coordinadores', asignacionController.obtenerCoordinadores);

// ✅ GET /api/asignaciones/docentes
router.get('/docentes', asignacionController.obtenerDocentes);

// ✅ POST /api/asignaciones/asignar
router.post('/asignar', asignacionController.asignarDocentes);

module.exports = router;
