// 📁 backend/models/Pregunta.js

const mongoose = require('mongoose');

// Esquema para las preguntas asociadas a un criterio de evaluación
const PreguntaSchema = new mongoose.Schema({
  // Relación con el criterio al que pertenece
  criterio: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CriterioEvaluacion',
    required: true
  },

  // Texto de la pregunta
  texto: {
    type: String,
    required: true,
    trim: true,
    maxlength: 300
  },

  // Tipo de respuesta permitida
  tipo_respuesta: {
    type: String,
    enum: ['abierta', 'multiple', 'unica', 'escala', 'si_no', 'rubrica', 'descriptiva'],
    default: 'escala'
  },

  // ¿Esta pregunta lleva calificación?
  evaluable: {
    type: Boolean,
    default: true
  },

  // Valor en porcentaje (por ejemplo, 20)
  valor: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },

  // Orden opcional de visualización
  orden: {
    type: Number,
    default: 1
  },

  // Estado activo/inactivo
  activo: {
    type: Boolean,
    default: true
  }

}, {
  timestamps: true // Guarda createdAt y updatedAt automáticamente
});

module.exports = mongoose.model('Pregunta', PreguntaSchema);
