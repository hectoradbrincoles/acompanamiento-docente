const Periodo = require('../models/Periodo');

// Crear periodo
exports.crearPeriodo = async (req, res) => {
  try {
    const nuevo = new Periodo(req.body);
    await nuevo.save();
    res.status(201).json({ message: 'Periodo académico creado.' });
  } catch (error) {
    res.status(400).json({ error: 'No se pudo crear el período. ' + error.message });
  }
};

// Listar periodos
exports.obtenerPeriodos = async (req, res) => {
  try {
    const periodos = await Periodo.find().sort({ fechaInicio: -1 });
    res.json(periodos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener periodos.' });
  }
};

// Editar
exports.editarPeriodo = async (req, res) => {
  try {
    await Periodo.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: 'Periodo actualizado.' });
  } catch (error) {
    res.status(400).json({ error: 'Error al editar el período.' });
  }
};

// Eliminar
exports.eliminarPeriodo = async (req, res) => {
  try {
    await Periodo.findByIdAndDelete(req.params.id);
    res.json({ message: 'Periodo eliminado.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el período.' });
  }
};
