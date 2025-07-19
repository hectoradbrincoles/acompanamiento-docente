const Especialidad = require('../models/Especialidad');

// Crear especialidad
exports.crearEspecialidad = async (req, res) => {
  try {
    const nueva = new Especialidad(req.body);
    await nueva.save();
    res.status(201).json({ message: 'Especialidad creada correctamente.' });
  } catch (error) {
    res.status(400).json({ error: 'No se pudo crear la especialidad. ' + error.message });
  }
};

// Obtener todas
exports.obtenerEspecialidades = async (req, res) => {
  try {
    const lista = await Especialidad.find().sort({ nombre: 1 });
    res.json(lista);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener especialidades.' });
  }
};

// Editar
exports.editarEspecialidad = async (req, res) => {
  try {
    await Especialidad.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: 'Especialidad actualizada.' });
  } catch (error) {
    res.status(400).json({ error: 'No se pudo actualizar.' });
  }
};

// Eliminar
exports.eliminarEspecialidad = async (req, res) => {
  try {
    await Especialidad.findByIdAndDelete(req.params.id);
    res.json({ message: 'Especialidad eliminada.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar.' });
  }
};
