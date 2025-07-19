// 📁 backend/routes/preguntaRoutes.js

const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/preguntaController');

// ✅ Crear una nueva pregunta
router.post('/', ctrl.crearPregunta);

// ✅ Obtener todas las preguntas o filtrar por criterio (usando query ?criterio=...)
router.get('/', ctrl.obtenerPreguntas);

// ✅ Obtener preguntas activas por ID de criterio (usado principalmente por el frontend)
router.get('/criterio/:criterioId', ctrl.obtenerPorCriterio);

// ✅ Editar una pregunta específica
router.put('/:id', ctrl.editarPregunta);

// ✅ Desactivar (eliminar lógicamente) una pregunta
router.delete('/:id', ctrl.eliminarPregunta);

module.exports = router;

