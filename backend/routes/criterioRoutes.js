// 📁 backend/routes/criterioRoutes.js

const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/criterioController');

// Crear un nuevo criterio
router.post('/', ctrl.crearCriterio);

// Obtener todos los criterios (con preguntas incluidas)
router.get('/', ctrl.obtenerCriterios);

// Editar un criterio existente
router.put('/:id', ctrl.editarCriterio);

// Desactivar un criterio (eliminación lógica)
router.delete('/:id', ctrl.eliminarCriterio);

module.exports = router;

