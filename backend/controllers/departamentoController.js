// 📁 backend/controllers/departamentoController.js

const Departamento = require('../models/Departamento');

// Crear departamento
exports.crearDepartamento = async (req, res) => {
  try {
    const nuevo = new Departamento(req.body);
    await nuevo.save();
    res.status(201).json({ message: 'Departamento creado correctamente.' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Obtener todos los departamentos
exports.obtenerDepartamentos = async (req, res) => {
  try {
    const departamentos = await Departamento.find().sort({ nombre: 1 });
    res.json(departamentos);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener departamentos.' });
  }
};

// Eliminar departamento
exports.eliminarDepartamento = async (req, res) => {
  try {
    await Departamento.findByIdAndDelete(req.params.id);
    res.json({ message: 'Departamento eliminado.' });
  } catch (err) {
    res.status(400).json({ error: 'No se pudo eliminar.' });
  }
};
