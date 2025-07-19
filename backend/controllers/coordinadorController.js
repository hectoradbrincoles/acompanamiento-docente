// 📁 backend/controllers/coordinadorController.js

const Usuario = require('../models/Usuario');
const Evaluacion = require('../models/Evaluacion');

exports.obtenerDocentesAsignados = async (req, res) => {
  try {
    const coordinadorId = req.usuario.id;
    const docentes = await Usuario.find({
      rol: 'Docente',
      coordinadorAsignado: coordinadorId
    }).select('-contrasena');
    res.status(200).json(docentes);
  } catch (error) {
    console.error('❌ Error al obtener docentes asignados:', error);
    res.status(500).json({ error: 'Error al obtener docentes asignados.' });
  }
};

exports.obtenerSeguimientoDocente = async (req, res) => {
  const { docenteId } = req.params;
  try {
    const evaluaciones = await Evaluacion.find({ docente: docenteId })
      .populate('evaluador', 'nombre')
      .sort({ fecha: -1 });
    res.status(200).json(evaluaciones);
  } catch (error) {
    console.error('❌ Error al obtener el seguimiento del docente:', error);
    res.status(500).json({ error: 'No se pudo obtener el seguimiento del docente.' });
  }
};

exports.agregarObservacion = async (req, res) => {
  const { docenteId } = req.params;
  const { observacion } = req.body;
  if (!observacion) {
    return res.status(400).json({ error: 'La observación es obligatoria.' });
  }

  try {
    const nuevaEvaluacion = new Evaluacion({
      docente: docenteId,
      evaluador: req.usuario.id,
      observacion,
      fecha: new Date()
    });
    await nuevaEvaluacion.save();
    res.status(201).json({ message: 'Observación registrada correctamente.' });
  } catch (error) {
    console.error('❌ Error al guardar observación:', error);
    res.status(500).json({ error: 'Error al guardar la observación.' });
  }
};
