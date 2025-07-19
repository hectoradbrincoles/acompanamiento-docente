// 📁 backend/models/Observacion.js

const mongoose = require('mongoose');

const observacionSchema = new mongoose.Schema({
  docente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  asignatura: {
    type: String,
    required: true
  },
  moduloFormativo: {
    type: String,
    required: false
  },
  fecha: {
    type: Date,
    default: Date.now
  },
  observador: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  resultadoFinal: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Observacion', observacionSchema);
