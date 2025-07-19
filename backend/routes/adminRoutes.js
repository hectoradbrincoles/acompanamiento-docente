// 📁 backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const Evaluacion = require('../models/Evaluacion');
const Usuario = require('../models/Usuario');

// ✅ Ruta: GET /api/admin/estadisticas
router.get('/estadisticas', authMiddleware, async (req, res) => {
  try {
    const totalUsuarios = await Usuario.countDocuments();
    const totalDocentes = await Usuario.countDocuments({ rol: 'Docente' });
    const totalEvaluaciones = await Evaluacion.countDocuments();
    const totalObservaciones = await Evaluacion.countDocuments({
      observaciones: { $ne: null, $ne: '' }
    });

    const desempeno = await Evaluacion.aggregate([
      {
        $group: {
          _id: '$docente',
          promedio: { $avg: '$saludo' } // Puedes cambiar 'saludo' por otro campo representativo
        }
      },
      {
        $lookup: {
          from: 'usuarios',
          localField: '_id',
          foreignField: '_id',
          as: 'docente'
        }
      },
      { $unwind: '$docente' },
      {
        $project: {
          nombre: '$docente.nombre',
          promedio: 1
        }
      }
    ]);

    const asignaturas = await Evaluacion.aggregate([
      {
        $group: {
          _id: '$moduloFormativo',
          cantidad: { $sum: 1 }
        }
      },
      {
        $project: {
          nombre: '$_id',
          cantidad: 1,
          _id: 0
        }
      }
    ]);

    res.json({
      totalUsuarios,
      totalDocentes,
      totalEvaluaciones,
      totalObservaciones,
      desempeno,
      asignaturas
    });
  } catch (error) {
    console.error('❌ Error al obtener estadísticas:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas del sistema' });
  }
});

// ✅ Ruta: POST /api/admin/asignar-docentes
router.post('/asignar-docentes', authMiddleware, async (req, res) => {
  try {
    const { coordinadorId, docentesIds } = req.body;

    if (!coordinadorId || !Array.isArray(docentesIds) || docentesIds.length === 0) {
      return res.status(400).json({ error: 'Faltan datos requeridos.' });
    }

    const coordinador = await Usuario.findById(coordinadorId);
    if (!coordinador || coordinador.rol !== 'Coordinador') {
      return res.status(404).json({ error: 'Coordinador no válido.' });
    }

    await Usuario.updateMany(
      { _id: { $in: docentesIds }, rol: 'Docente' },
      { $set: { coordinadorAsignado: coordinadorId } }
    );

    res.json({ message: 'Docentes asignados correctamente.' });
  } catch (error) {
    console.error('❌ Error al asignar docentes:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

module.exports = router;
