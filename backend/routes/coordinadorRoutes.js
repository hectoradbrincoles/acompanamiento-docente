// 📁 backend/routes/coordinadorRoutes.js

const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const Usuario = require('../models/Usuario');
const Evaluacion = require('../models/Evaluacion');

// 🛡️ Proteger todas las rutas con autenticación
router.use(auth);

/**
 * 🔍 Obtener docentes asignados al coordinador autenticado
 * Endpoint: GET /api/coordinador/docentes
 */
router.get('/docentes', async (req, res) => {
  try {
    const { id, rol } = req.usuario;

    if (rol !== 'Coordinador') {
      return res.status(403).json({ error: 'Acceso denegado. Solo para coordinadores.' });
    }

    const docentes = await Usuario.find({
      rol: { $in: ['Docente', 'docente'] },
      activo: true,
      coordinadorAsignado: id
    }).select('nombre correo asignatura');

    res.json(docentes);
  } catch (err) {
    console.error('❌ Error al obtener docentes asignados:', err);
    res.status(500).json({ error: 'No se pudieron obtener los docentes asignados.' });
  }
});

/**
 * 🔍 Obtener evaluaciones registradas por el coordinador autenticado
 * Endpoint: GET /api/coordinador/evaluaciones
 */
router.get('/evaluaciones', async (req, res) => {
  try {
    const evaluaciones = await Evaluacion.find({ usuario: req.usuario.id })
      .populate('usuario', 'nombre rol');

    res.json(evaluaciones);
  } catch (err) {
    console.error('❌ Error al obtener evaluaciones:', err);
    res.status(500).json({ error: 'No se pudieron obtener las evaluaciones.' });
  }
});

module.exports = router;
