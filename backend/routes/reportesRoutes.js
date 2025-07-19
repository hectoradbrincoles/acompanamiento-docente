// backend/routes/reportesRoutes.js

const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/reportesController');
const authMiddleware = require('../middlewares/authMiddleware');

// 📊 Resumen general para panel
router.get('/resumen', authMiddleware, ctrl.resumen);

// 📋 Reporte de desempeño por docente
router.get('/desempeno-docente', authMiddleware, ctrl.reporteDesempenoDocente);

// 📊 Reporte comparativo por área/asignatura
router.get('/comparativo-area', authMiddleware, ctrl.reporteComparativo);

// 🕘 Historial de evaluación por docente
router.get('/historial-docente', authMiddleware, ctrl.historialEvaluaciones);

// 🧾 Historial detallado de evaluación por docente (evolución + cantidad x área/especialidad)
router.get('/historial-detallado-docente', authMiddleware, ctrl.historialDetalladoDocente);

router.get('/observacion-clase', authMiddleware, ctrl.obtenerObservacionesClase);


module.exports = router;
