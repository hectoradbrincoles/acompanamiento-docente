// 📁 backend/models/CriterioEvaluacion.js
const mongoose = require('mongoose');

const criterioSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  descripcion: {
    type: String,
    trim: true,
    maxlength: 300
  },
  ponderacion: {
    type: Number,
    required: true,
    min: 1,
    max: 100 // porcentaje del total
  },
  orden: {
    type: Number,
    required: true,
    min: 1,
    unique: true
  },
  activo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('CriterioEvaluacion', criterioSchema);
