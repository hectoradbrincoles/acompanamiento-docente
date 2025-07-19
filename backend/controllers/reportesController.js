// backend/controllers/reportesController.js

const Usuario = require('../models/Usuario');
const Evaluacion = require('../models/Evaluacion');

// 📊 Resumen general (panel principal)
exports.resumen = async (req, res) => {
  try {
    const docentesUnicos = await Evaluacion.distinct('docente');
    const totalEvaluaciones = await Evaluacion.countDocuments();
    const totalReportes = 5;

    const evaluacionesPorMes = Array(12).fill(0);
    const evaluaciones = await Evaluacion.find({}, 'fecha');

    evaluaciones.forEach(ev => {
      if (ev.fecha) {
        const mes = new Date(ev.fecha).getMonth();
        evaluacionesPorMes[mes]++;
      }
    });

    res.json({
      totalDocentes: docentesUnicos.length,
      totalEvaluaciones,
      totalReportes,
      evaluacionesPorMes
    });
  } catch (err) {
    res.status(500).json({ error: 'Error al generar el resumen.' });
  }
};

// 📋 Reporte general de desempeño por docente
exports.reporteDesempenoDocente = async (req, res) => {
  try {
    const evaluaciones = await Evaluacion.find().populate('usuario', 'nombre');

    const resumen = {};

    evaluaciones.forEach(ev => {
      const docente = ev.docente;
      const modulo = ev.moduloFormativo || 'Sin módulo';
      const año = new Date(ev.fecha).getFullYear();

      const clave = `${docente}||${modulo}||${año}`;
      if (!resumen[clave]) {
        resumen[clave] = {
          docente,
          modulo,
          año,
          total: 0,
          componentes: {
            planificacion: 0,
            practica: 0
          },
          cantidad: 0
        };
      }

      const planificacion = [
        ev.planificacion?.ordenanza,
        ev.planificacion?.encabezado,
        ev.planificacion?.bloomNivel,
        ev.planificacion?.bloomElementos,
        ev.planificacion?.actividades,
        ev.planificacion?.fechasActividades,
        ev.planificacion?.instrumentos,
        ev.planificacion?.contenidos
      ].filter(Boolean).length;

      const practica = [
        ev.saludo, ev.presentacion, ev.asistencia
      ].map(n => parseInt(n) || 0).reduce((a, b) => a + b, 0);

      resumen[clave].total += planificacion + practica;
      resumen[clave].componentes.planificacion += planificacion;
      resumen[clave].componentes.practica += practica;
      resumen[clave].cantidad++;
    });

    const resultado = Object.values(resumen);
    res.json(resultado);
  } catch (err) {
    console.error('❌ Error en reporte de desempeño:', err);
    res.status(500).json({ error: 'Error al generar el reporte de desempeño.' });
  }
};

// 📊 Reporte comparativo por área/asignatura
exports.reporteComparativo = async (req, res) => {
  try {
    const datos = await Evaluacion.aggregate([
      {
        $lookup: {
          from: 'usuarios',
          localField: 'docente',
          foreignField: '_id',
          as: 'infoDocente'
        }
      },
      { $unwind: '$infoDocente' },
      {
        $group: {
          _id: '$infoDocente.asignatura',
          promedioArea: { $avg: '$resultadoFinal' },
          docentes: {
            $push: {
              nombre: '$infoDocente.nombre',
              resultado: '$resultadoFinal'
            }
          }
        }
      },
      { $sort: { promedioArea: -1 } }
    ]);

    res.json(datos);
  } catch (error) {
    console.error('❌ Error en reporte comparativo:', error);
    res.status(500).json({ error: 'Error al generar el reporte comparativo.' });
  }
};

// 📈 Historial de Evaluaciones por Docente
exports.historialEvaluaciones = async (req, res) => {
  try {
    const historial = await Evaluacion.aggregate([
      {
        $lookup: {
          from: 'usuarios',
          localField: 'docente',
          foreignField: '_id',
          as: 'docenteInfo'
        }
      },
      { $unwind: '$docenteInfo' },
      {
        $group: {
          _id: {
            docente: '$docenteInfo._id',
            nombre: '$docenteInfo.nombre',
            asignatura: '$docenteInfo.asignatura',
            especialidad: '$docenteInfo.especialidad',
            año: { $year: '$fecha' }
          },
          cantidadEvaluaciones: { $sum: 1 },
          modulos: { $addToSet: '$moduloFormativo' },
          resultadoTotal: { $sum: '$resultadoFinal' },
          promedioAnual: { $avg: '$resultadoFinal' }
        }
      },
      { $sort: { '_id.nombre': 1, '_id.año': 1 } }
    ]);

    res.json(historial);
  } catch (err) {
    console.error('❌ Error en historial de evaluaciones:', err);
    res.status(500).json({ error: 'Error al generar historial del docente.' });
  }
};

// 🧾 Historial Detallado con evolución, desempeño y conteo por especialidad
exports.historialDetalladoDocente = async (req, res) => {
  try {
    const evaluaciones = await Evaluacion.find().populate('usuario', 'nombre asignatura especialidad');

    const resumen = {};

    evaluaciones.forEach(ev => {
      const año = new Date(ev.fecha).getFullYear();
      const especialidad = ev.usuario?.especialidad || 'Sin especialidad';
      const asignatura = ev.usuario?.asignatura || 'Sin asignatura';
      const docente = ev.docente;
      const modulo = ev.moduloFormativo;

      if (!resumen[docente]) {
        resumen[docente] = {
          docente,
          asignaturas: new Set(),
          especialidades: new Set(),
          modulos: new Set(),
          anios: {}
        };
      }

      resumen[docente].asignaturas.add(asignatura);
      resumen[docente].especialidades.add(especialidad);
      resumen[docente].modulos.add(modulo);

      if (!resumen[docente].anios[año]) {
        resumen[docente].anios[año] = {
          cantidadEvaluaciones: 0,
          totalPuntaje: 0
        };
      }

      const planificacion = [
        ev.planificacion?.ordenanza,
        ev.planificacion?.encabezado,
        ev.planificacion?.bloomNivel,
        ev.planificacion?.bloomElementos,
        ev.planificacion?.actividades,
        ev.planificacion?.fechasActividades,
        ev.planificacion?.instrumentos,
        ev.planificacion?.contenidos
      ].filter(Boolean).length;

      const practica = [
        ev.saludo, ev.presentacion, ev.asistencia
      ].map(n => parseInt(n) || 0).reduce((a, b) => a + b, 0);

      const total = planificacion + practica;

      resumen[docente].anios[año].cantidadEvaluaciones++;
      resumen[docente].anios[año].totalPuntaje += total;
    });

    const resultado = Object.values(resumen).map(d => ({
      docente: d.docente,
      asignaturas: Array.from(d.asignaturas),
      especialidades: Array.from(d.especialidades),
      modulos: Array.from(d.modulos),
      evolucion: Object.entries(d.anios).map(([año, datos]) => ({
        año,
        cantidad: datos.cantidadEvaluaciones,
        promedio: (datos.totalPuntaje / datos.cantidadEvaluaciones).toFixed(2)
      }))
    }));

    res.json(resultado);
  } catch (error) {
    console.error('❌ Error en historial detallado:', error);
    res.status(500).json({ error: 'No se pudo generar el historial detallado.' });
  }
};

// 👁️ Observaciones de clase (historialObservacion.js)
const Observacion = require('../models/Observacion'); // Asegúrate de tener este modelo

exports.obtenerObservacionesClase = async (req, res) => {
  try {
    const observaciones = await Observacion.find()
      .populate('docente', 'nombre')
      .populate('observador', 'nombre');

    const resultado = observaciones.map(obs => ({
      docente: obs.docente?.nombre || '—',
      asignatura: obs.asignatura || '—',
      moduloFormativo: obs.moduloFormativo || '—',
      fecha: obs.fecha,
      observador: obs.observador?.nombre || '—',
      resultadoFinal: obs.resultadoFinal || 0
    }));

    res.json(resultado);
  } catch (err) {
    console.error('❌ Error al obtener observaciones:', err);
    res.status(500).json({ error: 'No se pudo obtener el historial de observaciones.' });
  }
};
