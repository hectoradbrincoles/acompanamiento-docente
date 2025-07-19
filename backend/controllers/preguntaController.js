// 📁 backend/controllers/preguntaController.js
const Pregunta = require('../models/Pregunta');

// ✅ Crear nueva pregunta
exports.crearPregunta = async (req, res) => {
  try {
    const {
      texto,
      criterio,
      evaluable = true,
      tipo_respuesta = 'escala',
      valor
    } = req.body;

    // Validación robusta
    if (!texto || !criterio || valor === undefined || isNaN(valor)) {
      return res.status(400).json({
        error: '❌ Los campos "texto", "criterio" y "valor" numérico son obligatorios.'
      });
    }

    const nueva = new Pregunta({
      texto,
      criterio,
      evaluable,
      tipo_respuesta,
      valor,
      activo: true
    });

    await nueva.save();
    res.status(201).json({
      message: '✅ Pregunta creada correctamente.',
      pregunta: nueva
    });
  } catch (error) {
    console.error('❌ Error al crear la pregunta:', error);
    res.status(400).json({ error: '❌ Error al crear la pregunta: ' + error.message });
  }
};

// ✅ Obtener todas las preguntas
exports.obtenerPreguntas = async (req, res) => {
  try {
    const filtro = req.query.criterio
      ? { criterio: req.query.criterio, activo: true }
      : { activo: true };

    const preguntas = await Pregunta.find(filtro)
      .sort({ orden: 1 })
      .populate('criterio', 'titulo');

    res.json(preguntas);
  } catch (error) {
    console.error('❌ Error al obtener preguntas:', error);
    res.status(500).json({ error: '❌ Error al obtener preguntas: ' + error.message });
  }
};

// ✅ Obtener preguntas por criterio
exports.obtenerPorCriterio = async (req, res) => {
  try {
    const preguntas = await Pregunta.find({
      criterio: req.params.criterioId,
      activo: true
    }).sort({ orden: 1 });

    res.json(preguntas);
  } catch (error) {
    console.error('❌ Error al obtener preguntas por criterio:', error);
    res.status(500).json({ error: '❌ Error al obtener preguntas por criterio: ' + error.message });
  }
};

// ✅ Editar pregunta
exports.editarPregunta = async (req, res) => {
  try {
    const { texto, evaluable, tipo_respuesta, valor } = req.body;

    if (!texto || valor === undefined || isNaN(valor)) {
      return res.status(400).json({
        error: '❌ Los campos "texto" y "valor" numérico son obligatorios para editar.'
      });
    }

    await Pregunta.findByIdAndUpdate(req.params.id, {
      texto,
      evaluable,
      tipo_respuesta,
      valor
    });

    res.json({ message: '✅ Pregunta actualizada correctamente.' });
  } catch (error) {
    console.error('❌ Error al editar pregunta:', error);
    res.status(400).json({ error: '❌ Error al editar pregunta: ' + error.message });
  }
};

// ✅ Eliminar (desactivar lógicamente)
exports.eliminarPregunta = async (req, res) => {
  try {
    await Pregunta.findByIdAndUpdate(req.params.id, { activo: false });
    res.json({ message: '✅ Pregunta desactivada correctamente.' });
  } catch (error) {
    console.error('❌ Error al desactivar pregunta:', error);
    res.status(500).json({ error: '❌ Error al desactivar pregunta: ' + error.message });
  }
};
