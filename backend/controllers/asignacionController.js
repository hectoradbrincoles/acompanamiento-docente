const Usuario = require('../models/Usuario');

// ✅ Obtener todos los coordinadores
exports.obtenerCoordinadores = async (req, res) => {
  try {
    const coordinadores = await Usuario.find({ 
      rol: { $in: ['Coordinador', 'coordinador'] }, 
      activo: true 
    }).select('_id nombre correo');
    
    res.json(coordinadores);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener coordinadores.' });
  }
};

// ✅ Obtener todos los docentes (con o sin asignación)
exports.obtenerDocentes = async (req, res) => {
  try {
    const docentes = await Usuario.find({ 
      rol: { $in: ['Docente', 'docente'] }, 
      activo: true 
    })
    .select('_id nombre correo coordinadorAsignado')
    .populate('coordinadorAsignado', 'nombre');

    res.json(docentes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener docentes.' });
  }
};

// ✅ Asignar docentes a un coordinador
exports.asignarDocentes = async (req, res) => {
  const { coordinadorId, docentesIds } = req.body;

  if (!coordinadorId || !Array.isArray(docentesIds)) {
    return res.status(400).json({ error: 'Datos incompletos para la asignación.' });
  }

  try {
    // Verifica que el coordinador exista
    const coordinador = await Usuario.findOne({ 
      _id: coordinadorId, 
      rol: { $in: ['Coordinador', 'coordinador'] } 
    });

    if (!coordinador) {
      return res.status(404).json({ error: 'Coordinador no encontrado.' });
    }

    // Asigna el coordinador a los docentes seleccionados
    await Usuario.updateMany(
      { _id: { $in: docentesIds }, rol: { $in: ['Docente', 'docente'] } },
      { $set: { coordinadorAsignado: coordinadorId } }
    );

    res.json({ message: 'Docentes asignados correctamente.' });
  } catch (error) {
    console.error('Error al asignar docentes:', error);
    res.status(500).json({ error: 'No se pudo asignar los docentes.' });
  }
};
