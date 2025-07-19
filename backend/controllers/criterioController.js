// 📁 backend/controllers/criterioController.js
const Criterio = require('../models/CriterioEvaluacion');
const Pregunta = require('../models/Pregunta');

// ✅ Crear nuevo criterio
exports.crearCriterio = async (req, res) => {
  try {
    const { titulo, descripcion, ponderacion, orden } = req.body;

    const nuevo = new Criterio({
      titulo,
      descripcion,
      ponderacion: ponderacion || 0,  // Por si no se pasa desde frontend
      orden: orden || 1
    });

    await nuevo.save();
    res.status(201).json({ message: '✅ Criterio creado correctamente.', criterio: nuevo });
  } catch (error) {
    res.status(400).json({ error: '❌ No se pudo crear el criterio: ' + error.message });
  }
};

// ✅ Obtener todos los criterios activos con sus preguntas
exports.obtenerCriterios = async (req, res) => {
  try {
    const criterios = await Criterio.find({ activo: true }).sort({ orden: 1 }).lean();

    // Traer preguntas asociadas (opcional para Frontend avanzado)
    const criteriosConPreguntas = await Promise.all(
      criterios.map(async (criterio) => {
        const preguntas = await Pregunta.find({ criterio: criterio._id, activo: true }).sort({ orden: 1 });
        return { ...criterio, preguntas };
      })
    );

    res.json(criteriosConPreguntas);
  } catch (error) {
    res.status(500).json({ error: '❌ Error al obtener los criterios: ' + error.message });
  }
};

// ✅ Editar criterio existente
exports.editarCriterio = async (req, res) => {
  try {
    const { id } = req.params;
    await Criterio.findByIdAndUpdate(id, req.body, { new: true });
    res.json({ message: '✅ Criterio actualizado correctamente.' });
  } catch (error) {
    res.status(400).json({ error: '❌ Error al actualizar el criterio: ' + error.message });
  }
};

// ✅ Eliminar (desactivar) criterio suavemente
exports.eliminarCriterio = async (req, res) => {
  try {
    const { id } = req.params;
    await Criterio.findByIdAndUpdate(id, { activo: false });
    res.json({ message: '✅ Criterio desactivado correctamente.' });
  } catch (error) {
    res.status(500).json({ error: '❌ Error al desactivar el criterio: ' + error.message });
  }
};
