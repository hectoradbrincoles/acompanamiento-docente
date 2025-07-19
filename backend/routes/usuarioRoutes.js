// 📁 backend/routes/usuarioRoutes.js
const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');

// ✅ Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const usuarios = await Usuario.find()
      .populate('departamento_id', 'nombre')
      .populate('coordinadorAsignado', 'nombre usuario correo')
      .populate('centroEducativo', 'nombre codigo') // Añadir si se usa en la vista
      .select('-contrasena');
    res.json(usuarios);
  } catch (error) {
    console.error('❌ Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error al obtener los usuarios.' });
  }
});

// ✅ Obtener usuario por ID (NUEVO, IMPRESCINDIBLE)
router.get('/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id)
      .populate('departamento_id', 'nombre')
      .populate('coordinadorAsignado', 'nombre usuario correo')
      .populate('centroEducativo', 'nombre codigo')
      .select('-contrasena');
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }
    res.json(usuario);
  } catch (error) {
    console.error('❌ Error al obtener usuario por ID:', error);
    res.status(500).json({ error: 'Error al obtener el usuario.' });
  }
});

// ✅ Actualizar usuario por ID con todos los campos permitidos
router.put('/:id', async (req, res) => {
  try {
    const {
      nombre,
      apellidos,
      cedula,
      usuario,
      correo,
      contrasena,
      rol,
      telefono,
      direccion,
      titulo_academico,
      departamento_id,
      area,
      correoInstitucional,
      asignatura,
      coordinadorAsignado,
      centroEducativo
    } = req.body;

    const datosActualizados = {
      nombre,
      apellidos,
      cedula,
      usuario,
      correo,
      rol,
      telefono,
      direccion,
      titulo_academico,
      departamento_id: departamento_id || null,
      area,
      correoInstitucional,
      asignatura,
      coordinadorAsignado: coordinadorAsignado || null,
      centroEducativo: centroEducativo || null
    };

    const actualizado = await Usuario.findByIdAndUpdate(
      req.params.id,
      datosActualizados,
      { new: true, runValidators: true }
    )
      .populate('departamento_id', 'nombre')
      .populate('coordinadorAsignado', 'nombre usuario correo')
      .populate('centroEducativo', 'nombre codigo')
      .select('-contrasena');

    if (!actualizado) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    res.json(actualizado);
  } catch (error) {
    console.error('❌ Error al actualizar usuario:', error);
    res.status(500).json({ error: 'Error al actualizar el usuario.' });
  }
});

// ✅ Eliminar usuario por ID
router.delete('/:id', async (req, res) => {
  try {
    const eliminado = await Usuario.findByIdAndDelete(req.params.id);

    if (!eliminado) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    res.json({ message: 'Usuario eliminado correctamente.' });
  } catch (error) {
    console.error('❌ Error al eliminar usuario:', error);
    res.status(500).json({ error: 'Error al eliminar el usuario.' });
  }
});

module.exports = router;
