// 📁 backend/models/Director.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const DirectorSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  apellidos: { type: String, trim: true },
  cedula: { type: String, trim: true },
  usuario: { type: String, required: true, unique: true, trim: true },
  correo: { type: String, required: true, unique: true, lowercase: true },
  contrasena: { type: String, required: true },
  telefono: { type: String },
  direccion: { type: String },
  titulo_academico: { type: String },
  departamento_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Departamento',
    default: null
  },
  area: { type: String },
  correoInstitucional: { type: String },
  asignatura: { type: String },
  activo: { type: Boolean, default: true },
  fechaRegistro: { type: Date, default: Date.now }
});

DirectorSchema.pre('save', async function (next) {
  if (!this.isModified('contrasena')) return next();
  const salt = await bcrypt.genSalt(10);
  this.contrasena = await bcrypt.hash(this.contrasena, salt);
  next();
});

DirectorSchema.methods.compararContrasena = function (entrada) {
  return bcrypt.compare(entrada, this.contrasena);
};

DirectorSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.contrasena;
  return obj;
};

module.exports = mongoose.model('Director', DirectorSchema);
