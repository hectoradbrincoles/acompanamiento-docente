// 📁 backend/controllers/evaluacionController.js
const mongoose = require('mongoose');
const Evaluacion = require('../models/Evaluacion');

exports.crearEvaluacion = async (req, res) => {
  try {
    let datos = req.body;
    console.log('📥 DATOS RECIBIDOS:', JSON.stringify(datos, null, 2));

    // Verificar y transformar campos que deben ser arrays
    const arrayFields = ['familias', 'dificultadesTrabajo', 'dificultadesInsumos', 
                        'dificultadesCondiciones', 'estrategias', 'dificultadesCompetencias'];
    
    arrayFields.forEach(field => {
      if (datos[field] && !Array.isArray(datos[field])) {
        datos[field] = datos[field] ? [datos[field]] : [];
      } else if (!datos[field]) {
        datos[field] = [];
      }
    });

    // Mover campos de planificación si vienen en el nivel superior
    if (!datos.planificacion) {
      datos.planificacion = {};
      const planFields = ['ordenanza', 'encabezado', 'bloomNivel', 'bloomElementos', 
                         'actividades', 'fechasActividades', 'instrumentos', 'contenidos'];
      
      planFields.forEach(field => {
        if (datos[field] !== undefined) {
          datos.planificacion[field] = datos[field];
          delete datos[field];
        }
      });
    }

    // Validar IDs
    if (datos.docente && !mongoose.Types.ObjectId.isValid(datos.docente)) {
      return res.status(400).json({ error: 'ID de docente no válido' });
    }

    if (datos.coordinador && !mongoose.Types.ObjectId.isValid(datos.coordinador)) {
      return res.status(400).json({ error: 'ID de coordinador no válido' });
    }

    datos.usuario = req.usuario?.id || null;
    datos.calificacion = datos.calificacion ?? 0;

    const evaluacion = new Evaluacion(datos);
    await evaluacion.save();

    res.status(201).json({ 
      message: 'Evaluación registrada correctamente',
      id: evaluacion._id 
    });
  } catch (error) {
    console.error('❌ Error al guardar evaluación:', error);
    res.status(400).json({ 
      error: error.message || 'Error al guardar la evaluación',
      details: error.errors 
    });
  }
};


// ✅ Obtener todas las evaluaciones
exports.obtenerEvaluaciones = async (req, res) => {
  try {
    const evaluaciones = await Evaluacion.find()
      .populate('usuario', 'nombre usuario rol')
      .populate('docente', 'nombre usuario rol');
    res.json(evaluaciones);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las evaluaciones.' });
  }
};

// ✅ Obtener evaluación por ID
exports.obtenerEvaluacionPorId = async (req, res) => {
  try {
    const evaluacion = await Evaluacion.findById(req.params.id)
      .populate('usuario', 'nombre usuario rol')
      .populate('docente', 'nombre usuario rol');
    if (!evaluacion) return res.status(404).json({ error: 'Evaluación no encontrada.' });
    res.json(evaluacion);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar la evaluación.' });
  }
};

// ✅ Actualizar evaluación
exports.actualizarEvaluacion = async (req, res) => {
  try {
    const evaluacion = await Evaluacion.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!evaluacion) return res.status(404).json({ error: 'Evaluación no encontrada.' });
    res.json({ message: 'Evaluación actualizada.', evaluacion });
  } catch (error) {
    res.status(400).json({ error: error.message || 'No se pudo actualizar la evaluación.' });
  }
};

// ✅ Eliminar evaluación
exports.eliminarEvaluacion = async (req, res) => {
  try {
    const evaluacion = await Evaluacion.findByIdAndDelete(req.params.id);
    if (!evaluacion) return res.status(404).json({ error: 'Evaluación no encontrada.' });
    res.json({ message: 'Evaluación eliminada.' });
  } catch (error) {
    res.status(500).json({ error: error.message || 'No se pudo eliminar la evaluación.' });
  }
};
