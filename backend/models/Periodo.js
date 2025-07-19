const mongoose = require('mongoose');

const periodoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: 100
  },
  fechaInicio: {
    type: Date,
    required: true
  },
  fechaFin: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Periodo', periodoSchema);
