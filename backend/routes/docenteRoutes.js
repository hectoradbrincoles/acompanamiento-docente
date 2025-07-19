// 📁 backend/routes/docenteRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

const {
  obtenerProyectosAsignados,
  obtenerEvaluacionesDocente,
  obtenerResumenAcompanamientos,
  obtenerDocentePorId,
  obtenerDashboardDocente
} = require('../controllers/docenteController');

// 📈 Obtener estadísticas del panel del docente (gráficos e indicadores)
router.get('/dashboard', authMiddleware, obtenerDashboardDocente);

// 🧑‍🏫 Obtener proyectos asignados al docente autenticado
router.get('/proyectos', authMiddleware, obtenerProyectosAsignados);

// 📝 Obtener evaluaciones realizadas al docente autenticado
router.get('/evaluaciones', authMiddleware, obtenerEvaluacionesDocente);

// 📊 Obtener resumen del docente (opcional si aún se usa)
router.get('/resumen', authMiddleware, obtenerResumenAcompanamientos);

// 🔍 Obtener datos de un docente por su ID (usado desde el panel del coordinador)
router.get('/:id', authMiddleware, obtenerDocentePorId);

module.exports = router;
