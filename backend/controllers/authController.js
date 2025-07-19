// 📁 backend/controllers/authController.js

const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET || 'secretoSuperSeguro';

// 🔐 Función para generar token JWT
const generarToken = (usuario) => {
  return jwt.sign(
    { id: usuario._id, rol: usuario.rol },
    jwtSecret,
    { expiresIn: '8h' }
  );
};

// ✅ Registro de usuario
exports.registrar = async (req, res) => {
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

    const nuevoUsuario = new Usuario({
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
      departamento_id: departamento_id || null,
      area,
      correoInstitucional,
      asignatura,
      coordinadorAsignado: coordinadorAsignado || null,
      centroEducativo: centroEducativo || null
    });

    await nuevoUsuario.save();
    res.status(201).json({ message: 'Usuario registrado correctamente.' });

  } catch (err) {
    console.error('❌ Error al registrar usuario:', err);
    res.status(400).json({ error: err.message });
  }
};

// 🔐 Login
exports.login = async (req, res) => {
  try {
    const { usuario, contrasena } = req.body;

    const user = await Usuario.findOne({ usuario });
    if (!user || !user.activo) {
      return res.status(404).json({ error: 'Usuario no encontrado o inactivo.' });
    }

    const esValida = await user.compararContrasena(contrasena);
    if (!esValida) {
      return res.status(401).json({ error: 'Contraseña incorrecta.' });
    }

    const token = generarToken(user);

    res.json({
      token,
      usuario: user.usuario,
      rol: user.rol,
      nombre: user.nombre,
      id: user._id,
      coordinadorAsignado: user.coordinadorAsignado || null
    });

  } catch (err) {
    console.error('❌ Error en login:', err);
    res.status(500).json({ error: 'Error al iniciar sesión.' });
  }
};

// 👤 Obtener perfil del usuario autenticado
exports.perfil = async (req, res) => {
  try {
    const user = await Usuario.findById(req.usuario.id)
      .populate('departamento_id', 'nombre')
      .populate('coordinadorAsignado', 'nombre usuario')
      .populate('centroEducativo', 'nombre codigo')
      .select('-contrasena');

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    res.json(user);
  } catch (err) {
    console.error('❌ Error al obtener perfil:', err);
    res.status(500).json({ error: 'Error al obtener perfil.' });
  }
};

// ✅ NUEVO: Actualizar usuario (incluye centroEducativo)
exports.actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const datosActualizados = {
      nombre: req.body.nombre,
      apellidos: req.body.apellidos,
      usuario: req.body.usuario,
      correo: req.body.correo,
      rol: req.body.rol,
      cedula: req.body.cedula,
      telefono: req.body.telefono,
      direccion: req.body.direccion,
      titulo_academico: req.body.titulo_academico,
      area: req.body.area,
      correoInstitucional: req.body.correoInstitucional,
      asignatura: req.body.asignatura,
      departamento_id: req.body.departamento_id || null,
      centroEducativo: req.body.centroEducativo || null
    };

    const usuario = await Usuario.findByIdAndUpdate(id, datosActualizados, { new: true });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    res.json({ message: 'Usuario actualizado correctamente.', usuario });
  } catch (err) {
    console.error('❌ Error al actualizar usuario:', err);
    res.status(500).json({ error: 'Error al actualizar el usuario.' });
  }
};
