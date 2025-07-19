// 📁 backend/routes/evaluacionRoutes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/evaluacionController');
const auth = require('../middlewares/authMiddleware');

// Registrar nueva evaluación (solo autenticados)
router.post('/', auth, ctrl.crearEvaluacion);

// Listar todas las evaluaciones (solo autenticados)
router.get('/', auth, ctrl.obtenerEvaluaciones);

// Obtener una evaluación por ID (solo autenticados)
router.get('/:id', auth, ctrl.obtenerEvaluacionPorId);

// Actualizar evaluación (solo autenticados)
router.put('/:id', auth, ctrl.actualizarEvaluacion);

// Eliminar evaluación (solo autenticados)
router.delete('/:id', auth, ctrl.eliminarEvaluacion);

module.exports = router;


