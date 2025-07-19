// 📁 backend/models/CentroEducativo.js
const mongoose = require('mongoose');

const centroSchema = new mongoose.Schema({
  codigo: {
    type: String,
    required: true,
    unique: true,
    maxlength: 10,
    trim: true,
    uppercase: true
  },
  nombre: {
    type: String,
    required: true,
    maxlength: 100,
    trim: true
  },
  direccion: {
    type: String,
    required: true,
    maxlength: 150
  },
  regional: {
    type: String,
    required: true,
    maxlength: 100
  },
  distrito: {
    type: String,
    required: true,
    maxlength: 100
  },
  telefono: {
    type: String,
    maxlength: 20,
    validate: {
      validator: function(v) {
        return /^[0-9()-]+$/.test(v);
      },
      message: props => `${props.value} no es un número de teléfono válido!`
    }
  },
  director: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario'
  },
  activo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices para mejor performance
centroSchema.index({ nombre: 1 });
centroSchema.index({ codigo: 1 }, { unique: true });
centroSchema.index({ distrito: 1, regional: 1 });

// Middleware para normalizar datos antes de guardar
centroSchema.pre('save', function(next) {
  this.nombre = this.nombre.replace(/\s+/g, ' ').trim();
  next();
});

// Virtual para docentes asociados
centroSchema.virtual('docentes', {
  ref: 'Usuario',
  localField: '_id',
  foreignField: 'centroEducativo'
});

module.exports = mongoose.model('CentroEducativo', centroSchema);