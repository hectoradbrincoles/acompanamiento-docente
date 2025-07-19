const mongoose = require('mongoose');

const asignaturaSchema = new mongoose.Schema({
  codigo: {
    type: String,
    required: true,
    unique: true,
    maxlength: 10,
    trim: true
  },
  nombre: {
    type: String,
    required: true,
    maxlength: 100,
    trim: true
  },
  creditos: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Asignatura', asignaturaSchema);
