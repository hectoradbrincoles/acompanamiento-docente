const mongoose = require('mongoose');

const especialidadSchema = new mongoose.Schema({
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
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Especialidad', especialidadSchema);
