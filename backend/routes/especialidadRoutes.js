const express = require('express');
const router = express.Router();
const controlador = require('../controllers/especialidadController');

router.post('/', controlador.crearEspecialidad);
router.get('/', controlador.obtenerEspecialidades);
router.put('/:id', controlador.editarEspecialidad);
router.delete('/:id', controlador.eliminarEspecialidad);

module.exports = router;
