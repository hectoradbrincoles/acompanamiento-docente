// 📁 backend/controllers/centroController.js
const Centro = require('../models/CentroEducativo');
const Usuario = require('../models/Usuario');

// Crear centro
exports.crearCentro = async (req, res) => {
  try {
    const { codigo, nombre } = req.body;
    
    // Verificar si el código o nombre ya existen
    const existe = await Centro.findOne({
      $or: [
        { codigo: { $regex: new RegExp(`^${codigo}$`, 'i') } },
        { nombre: { $regex: new RegExp(`^${nombre}$`, 'i') } }
      ]
    });

    if (existe) {
      return res.status(400).json({ 
        error: `Ya existe un centro con ${existe.codigo === codigo ? 'ese código' : 'ese nombre'}` 
      });
    }

    const nuevo = new Centro(req.body);
    await nuevo.save();
    res.status(201).json({ 
      message: 'Centro educativo creado.',
      centro: nuevo
    });
  } catch (error) {
    res.status(400).json({ 
      error: 'No se pudo crear el centro.',
      detalles: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Listar centros (con opción de populate)
exports.obtenerCentros = async (req, res) => {
  try {
    const { conUsuarios } = req.query;
    
    let centros = Centro.find().sort({ nombre: 1 });
    
    if (conUsuarios === 'true') {
      centros = centros.populate({
        path: 'director',
        select: 'nombre apellidos correo'
      });
    }
    
    const resultados = await centros.exec();
    res.json(resultados);
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al obtener centros.',
      detalles: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Obtener un centro específico (para el formulario)
exports.obtenerCentro = async (req, res) => {
  try {
    const centro = await Centro.findById(req.params.id)
      .populate('director', 'nombre apellidos correo')
      .populate({
        path: 'docentes',
        select: 'nombre apellidos correo rol',
        match: { activo: true }
      });
      
    if (!centro) {
      return res.status(404).json({ error: 'Centro no encontrado' });
    }
    
    res.json(centro);
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al obtener centro',
      detalles: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Editar centro
exports.editarCentro = async (req, res) => {
  try {
    const { id } = req.params;
    const { codigo, nombre } = req.body;
    
    // Verificar duplicados al editar
    const existe = await Centro.findOne({
      _id: { $ne: id },
      $or: [
        { codigo: { $regex: new RegExp(`^${codigo}$`, 'i') } },
        { nombre: { $regex: new RegExp(`^${nombre}$`, 'i') } }
      ]
    });
    
    if (existe) {
      return res.status(400).json({ 
        error: `Ya existe otro centro con ${existe.codigo === codigo ? 'ese código' : 'ese nombre'}` 
      });
    }

    const actualizado = await Centro.findByIdAndUpdate(id, req.body, { 
      new: true,
      runValidators: true 
    });
    
    if (!actualizado) {
      return res.status(404).json({ error: 'Centro no encontrado' });
    }
    
    res.json({ 
      message: 'Centro actualizado.',
      centro: actualizado
    });
  } catch (error) {
    res.status(400).json({ 
      error: 'Error al editar el centro.',
      detalles: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Eliminar centro (con verificación)
exports.eliminarCentro = async (req, res) => {
  try {
    // Verificar si hay docentes asociados
    const tieneDocentes = await Usuario.exists({ centroEducativo: req.params.id });
    
    if (tieneDocentes) {
      return res.status(400).json({ 
        error: 'No se puede eliminar, hay docentes asignados a este centro' 
      });
    }

    const eliminado = await Centro.findByIdAndDelete(req.params.id);
    
    if (!eliminado) {
      return res.status(404).json({ error: 'Centro no encontrado' });
    }
    
    res.json({ message: 'Centro eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ 
      error: 'Error al eliminar el centro.',
      detalles: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};