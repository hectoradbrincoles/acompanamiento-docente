const express = require('express');
const router = express.Router();
const departamentoController = require('../controllers/departamentoController');

// 🔒 Puedes agregar middleware de autenticación si deseas
router.post('/', departamentoController.crearDepartamento);
router.get('/', departamentoController.obtenerDepartamentos);
router.delete('/:id', departamentoController.eliminarDepartamento);

module.exports = router;
