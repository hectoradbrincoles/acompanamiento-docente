// Ruta: backend/scripts/crearAdmin.js
require('dotenv').config({ path: __dirname + '/../.env' });

const mongoose = require('mongoose');
const Usuario = require('../models/Usuario');

async function crearAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const existe = await Usuario.findOne({ usuario: 'admin' });
    if (existe) {
      console.log('Ya existe un usuario admin.');
      process.exit(0);
    }
    const admin = new Usuario({
      nombre: 'Administrador',
      usuario: 'admin',
      correo: 'admin@admin.com',
      contrasena: 'admin123',
      rol: 'admin',
      activo: true,
    });
    await admin.save();
    console.log('Usuario admin creado correctamente.');
    process.exit(0);
  } catch (err) {
    console.error('Error creando admin:', err);
    process.exit(1);
  }
}

crearAdmin();
