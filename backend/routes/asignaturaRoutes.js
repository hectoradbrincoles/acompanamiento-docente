const express = require('express');
const router = express.Router();
const asignaturaController = require('../controllers/asignaturaController');

// POST: Crear nueva asignatura
router.post('/', asignaturaController.crearAsignatura);

// GET: Obtener todas las asignaturas
router.get('/', asignaturaController.obtenerAsignaturas);

// DELETE: Eliminar asignatura
router.delete('/:id', asignaturaController.eliminarAsignatura);

module.exports = router;
