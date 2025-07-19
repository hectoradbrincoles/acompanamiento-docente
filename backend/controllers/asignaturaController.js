const Asignatura = require('../models/Asignatura');

// ✅ Crear nueva asignatura
exports.crearAsignatura = async (req, res) => {
  try {
    const nuevaAsignatura = new Asignatura(req.body);
    await nuevaAsignatura.save();
    res.status(201).json({ message: 'Asignatura creada correctamente.' });
  } catch (error) {
    console.error('Error al crear asignatura:', error);
    res.status(400).json({ error: 'No se pudo crear la asignatura. ' + error.message });
  }
};

// ✅ Obtener todas las asignaturas
exports.obtenerAsignaturas = async (req, res) => {
  try {
    const asignaturas = await Asignatura.find().sort({ nombre: 1 });
    res.json(asignaturas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener asignaturas.' });
  }
};

// ✅ Eliminar asignatura
exports.eliminarAsignatura = async (req, res) => {
  try {
    const { id } = req.params;
    await Asignatura.findByIdAndDelete(id);
    res.json({ message: 'Asignatura eliminada.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar asignatura.' });
  }
};
