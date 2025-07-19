// 📁 backend/controllers/docenteController.js
const Proyecto = require('../models/Proyecto');
const Evaluacion = require('../models/Evaluacion');
const Usuario = require('../models/Usuario');

// 🔍 Obtener proyectos asignados al docente autenticado
const obtenerProyectosAsignados = async (req, res) => {
  try {
    const proyectos = await Proyecto.find({ docente: req.usuario.id });
    res.json(proyectos);
  } catch (error) {
    console.error('❌ Error al obtener proyectos:', error);
    res.status(500).json({ error: 'Error al obtener proyectos asignados.' });
  }
};

// 📊 Obtener evaluaciones realizadas al docente autenticado (con filtros opcionales)
const obtenerEvaluacionesDocente = async (req, res) => {
  try {
    const { asignatura, fechaMin, fechaMax } = req.query;
    const filtro = { docente: req.usuario.id };

    if (asignatura) {
      filtro.asignatura = { $regex: new RegExp(asignatura, 'i') }; // Búsqueda flexible
    }
    if (fechaMin || fechaMax) {
      filtro.fecha = {};
      if (fechaMin) filtro.fecha.$gte = new Date(fechaMin);
      if (fechaMax) filtro.fecha.$lte = new Date(fechaMax);
    }

    const evaluaciones = await Evaluacion.find(filtro)
      .populate('coordinador', 'nombre')
      .sort({ fecha: -1 });

    res.json(evaluaciones);
  } catch (error) {
    console.error('❌ Error al obtener evaluaciones:', error);
    res.status(500).json({ error: 'Error al obtener evaluaciones del docente.' });
  }
};

// 📋 Obtener resumen de acompañamientos realizados al docente autenticado
const obtenerResumenAcompanamientos = async (req, res) => {
  try {
    const total = await Evaluacion.countDocuments({ docente: req.usuario.id });
    const recientes = await Evaluacion.find({ docente: req.usuario.id })
      .sort({ fecha: -1 })
      .limit(3)
      .populate('coordinador', 'nombre');

    res.json({ total, recientes });
  } catch (error) {
    console.error('❌ Error al obtener resumen:', error);
    res.status(500).json({ error: 'Error al obtener el resumen del docente.' });
  }
};

// ✅ Obtener un docente por su ID (usado al evaluar desde el botón del coordinador)
const obtenerDocentePorId = async (req, res) => {
  try {
    const docente = await Usuario.findById(req.params.id)
      .select('nombre correo correoInstitucional rol coordinadorAsignado')
      .populate('coordinadorAsignado', 'nombre correo');

    if (!docente || !String(docente.rol).toLowerCase().includes('docente')) {
      console.warn('⚠️ Usuario no encontrado o no es docente');
      return res.status(404).json({ error: 'Docente no encontrado' });
    }

    res.json({
      nombre: docente.nombre,
      correo: docente.correo,
      correoInstitucional: docente.correoInstitucional,
      coordinador: docente.coordinadorAsignado ? {
        _id: docente.coordinadorAsignado._id,
        nombre: docente.coordinadorAsignado.nombre,
        correo: docente.coordinadorAsignado.correo
      } : null
    });
  } catch (error) {
    console.error('❌ Error al obtener docente por ID:', error.message);
    res.status(500).json({ error: 'Error al obtener el docente.' });
  }
};

// 📊 Endpoint para el dashboard del docente (gráficas y estadísticas)
const obtenerDashboardDocente = async (req, res) => {
  try {
    const docenteId = req.usuario.id;

    const evaluaciones = await Evaluacion.find({ docente: docenteId }).sort({ fecha: 1 });

    const totalEvaluaciones = evaluaciones.length;
    const ultimaEvaluacion = evaluaciones.at(-1);
    const ultimaCalificacion = ultimaEvaluacion?.puntaje ?? null;
    const ultimaFecha = ultimaEvaluacion?.fecha?.toISOString().split('T')[0] ?? null;

    const calificaciones = evaluaciones.map(ev => ({
      mes: ev.fecha.toLocaleString('default', { month: 'short' }),
      valor: ev.puntaje
    }));

    const evaluacionesMensuales = {};
    for (const ev of evaluaciones) {
      const mes = ev.fecha.toLocaleString('default', { month: 'short' });
      evaluacionesMensuales[mes] = (evaluacionesMensuales[mes] || 0) + 1;
    }

    const resumen = {
      totalEvaluaciones,
      ultimaCalificacion,
      ultimaFecha,
      calificaciones,
      evaluacionesMensuales: Object.entries(evaluacionesMensuales).map(([mes, total]) => ({ mes, total }))
    };

    res.json(resumen);
  } catch (error) {
    console.error('❌ Error en dashboard:', error);
    res.status(500).json({ error: 'Error al cargar el dashboard del docente.' });
  }
};

module.exports = {
  obtenerProyectosAsignados,
  obtenerEvaluacionesDocente,
  obtenerResumenAcompanamientos,
  obtenerDocentePorId,
  obtenerDashboardDocente,
};
