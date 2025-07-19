// 📁 backend/models/Proyecto.js
const mongoose = require('mongoose');

const ProyectoSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true,
    trim: true
  },
  descripcion: {
    type: String,
    default: ''
  },
  docente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  fechaAsignacion: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Proyecto', ProyectoSchema);
