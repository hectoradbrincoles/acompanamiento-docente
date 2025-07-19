// 📁 backend/models/DistritoEducativo.js
const mongoose = require('mongoose');

const DistritoEducativoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  codigo: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  provincia: {
    type: String,
    required: true,
    trim: true
  },
  region: {
    type: String,
    required: true,
    trim: true
  },
  activo: {
    type: Boolean,
    default: true
  },
  fechaRegistro: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('DistritoEducativo', DistritoEducativoSchema);
