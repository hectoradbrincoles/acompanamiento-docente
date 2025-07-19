const mongoose = require('mongoose');

const departamentoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    maxlength: 100
  },
  descripcion: {
    type: String,
    default: '',
    trim: true
  },
  creadoEn: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Departamento', departamentoSchema);
