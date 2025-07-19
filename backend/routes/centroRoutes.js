// 📁 backend/routes/centroRoutes.js
const express = require('express');
const router = express.Router();
const centroController = require('../controllers/centroController');

router.post('/', centroController.crearCentro);
router.get('/', centroController.obtenerCentros);
router.get('/:id', centroController.obtenerCentro); // Nueva ruta
router.put('/:id', centroController.editarCentro);
router.delete('/:id', centroController.eliminarCentro);

module.exports = router;