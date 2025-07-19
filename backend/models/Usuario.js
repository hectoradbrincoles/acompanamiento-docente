// 📁 backend/models/Usuario.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UsuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  usuario: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  correo: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  contrasena: {
    type: String,
    required: true
  },
  rol: {
    type: String,
    enum: ['Administrador', 'Director', 'Coordinador', 'Docente'],
    default: 'Docente'
  },
  activo: {
    type: Boolean,
    default: true
  },

  // 🔽 CAMPOS NUEVOS (relacionados al modelo de "profesores")

  cedula: {
    type: String,
    default: '',
    trim: true
  },
  apellidos: {
    type: String,
    default: '',
    trim: true
  },
  telefono: {
    type: String,
    default: ''
  },
  direccion: {
    type: String,
    default: ''
  },
  titulo_academico: {
    type: String,
    default: ''
  },
  departamento_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Departamento',
    default: null
  },

  centroEducativo: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'CentroEducativo',
  required: false
},


  area: {
    type: String,
    default: ''
  },
  correoInstitucional: {
    type: String,
    default: ''
  },
  asignatura: {
    type: String,
    default: ''
  },
  coordinadorAsignado: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    default: null
  },

  fechaRegistro: {
    type: Date,
    default: Date.now
  }
});

// 🔐 Middleware para hashear contraseña
UsuarioSchema.pre('save', async function (next) {
  if (!this.isModified('contrasena')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.contrasena = await bcrypt.hash(this.contrasena, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// 🔐 Método para comparar contraseñas
UsuarioSchema.methods.compararContrasena = function (entrada) {
  return bcrypt.compare(entrada, this.contrasena);
};

// 🧼 Eliminar campo sensible al convertir a JSON
UsuarioSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.contrasena;
  return obj;
};

module.exports = mongoose.model('Usuario', UsuarioSchema);
