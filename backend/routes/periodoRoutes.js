const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/periodoController');

router.post('/', ctrl.crearPeriodo);
router.get('/', ctrl.obtenerPeriodos);
router.put('/:id', ctrl.editarPeriodo);
router.delete('/:id', ctrl.eliminarPeriodo);

module.exports = router;
