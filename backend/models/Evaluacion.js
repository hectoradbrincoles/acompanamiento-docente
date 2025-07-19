// 📁 backend/models/Evaluacion.js
const mongoose = require('mongoose');

const EvaluacionSchema = new mongoose.Schema({
  // ============ DATOS GENERALES ============
  fecha: { 
    type: Date, 
    required: [true, 'La fecha es requerida'],
    validate: {
      validator: function(value) {
        return value <= new Date();
      },
      message: 'La fecha no puede ser futura'
    }
  },
  
  horaInicio: { 
    type: String,
    required: [true, 'La hora de inicio es requerida'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido (HH:MM)']
  },
  
  centroEducativo: { 
    type: String,
    required: [true, 'El centro educativo es requerido'],
    maxlength: [100, 'El nombre no puede exceder 100 caracteres']
  },
  
  distrito: { 
    type: String,
    required: [true, 'El distrito es requerido'],
    maxlength: [50, 'El distrito no puede exceder 50 caracteres']
  },
  
  codigoCentro: { 
    type: String,
    required: [true, 'El código del centro es requerido'],
    maxlength: [20, 'El código no puede exceder 20 caracteres']
  },

  // ============ INFORMACIÓN DE USUARIOS ============
  coordinador: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: [true, 'El coordinador es requerido']
  },
  
  correoCoordinador: {
    type: String,
    required: [true, 'El correo del coordinador es requerido'],
    match: [/^\S+@\S+\.\S+$/, 'Correo electrónico inválido']
  },
  
  correoInstitucional: {
    type: String,
    required: [true, 'El correo institucional es requerido'],
    match: [/^\S+@\S+\.\S+$/, 'Correo electrónico inválido']
  },
  
  docente: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: [true, 'El docente es requerido']
  },

  // ============ ASPECTOS DEL MÓDULO ============
  familias: [{ 
    type: String,
    required: [true, 'Al menos una familia profesional es requerida'],
    enum: {
      values: [
        'Gestión Administrativa y Tributaria',
        'Minería',
        'Mecanizado',
        'Equipos Electrónicos',
        'Soportes de redes y equipos informáticos'
      ],
      message: 'Familia profesional no válida'
    }
  }],
  
  moduloFormativo: { 
    type: String,
    required: [true, 'El módulo formativo es requerido'],
    maxlength: [100, 'El módulo no puede exceder 100 caracteres']
  },
  
  resultadoAprendizaje: { 
    type: String,
    required: [true, 'El resultado de aprendizaje es requerido'],
    maxlength: [200, 'El RA no puede exceder 200 caracteres']
  },

  // ============ DIFICULTADES Y CONDICIONES ============
  dificultadesTrabajo: [{
    type: String,
    enum: {
      values: [
        'Ninguna dificultad',
        'Falta de laboratorios',
        'Falta de talleres',
        'Carencia de equipamiento',
        'Limitaciones de espacios'
      ],
      message: 'Opción no válida para dificultades de trabajo'
    }
  }],
  
  dificultadesInsumos: [{
    type: String,
    enum: {
      values: [
        'Ninguna dificultad',
        'Falta de laboratorios',
        'Falta de talleres',
        'Carencia de equipamiento',
        'Limitaciones de espacios'
      ],
      message: 'Opción no válida para dificultades de insumos'
    }
  }],
  
  dificultadesCondiciones: [{
    type: String,
    enum: {
      values: [
        'Ninguna dificultad',
        'Falta de laboratorios',
        'Falta de talleres',
        'Carencia de equipamiento',
        'Limitaciones de espacios'
      ],
      message: 'Opción no válida para dificultades de condiciones'
    }
  }],

  // ============ PLANIFICACIÓN ============
  planificacion: {
    ordenanza: {
      type: String,
      required: [true, 'La ordenanza es requerida'],
      enum: {
        values: ['Sí', 'Sí, pero puede mejorar', 'No'],
        message: 'Opción no válida para ordenanza'
      }
    },
    encabezado: {
      type: String,
      required: [true, 'El encabezado es requerido'],
      enum: {
        values: ['Sí', 'Sí, pero puede mejorar', 'No'],
        message: 'Opción no válida para encabezado'
      }
    },
    bloomNivel: {
      type: String,
      required: [true, 'El nivel Bloom es requerido'],
      enum: {
        values: ['Sí', 'Sí, pero puede mejorar', 'No'],
        message: 'Opción no válida para nivel Bloom'
      }
    },
    bloomElementos: {
      type: String,
      required: [true, 'Los elementos Bloom son requeridos'],
      enum: {
        values: ['Sí', 'Sí, pero puede mejorar', 'No'],
        message: 'Opción no válida para elementos Bloom'
      }
    },
    actividades: {
      type: String,
      required: [true, 'Las actividades son requeridas'],
      enum: {
        values: ['Sí', 'Sí, pero puede mejorar', 'No'],
        message: 'Opción no válida para actividades'
      }
    },
    fechasActividades: {
      type: String,
      required: [true, 'Las fechas de actividades son requeridas'],
      enum: {
        values: ['Sí', 'No'],
        message: 'Opción no válida para fechas de actividades'
      }
    },
    instrumentos: {
      type: String,
      required: [true, 'Los instrumentos son requeridos'],
      enum: {
        values: ['Sí', 'Sí, pero puede mejorar', 'No'],
        message: 'Opción no válida para instrumentos'
      }
    },
    contenidos: {
      type: String,
      required: [true, 'Los contenidos son requeridos'],
      enum: {
        values: ['Sí', 'Sí, pero puede mejorar', 'No'],
        message: 'Opción no válida para contenidos'
      }
    }
  },

  // ============ ACOMPAÑAMIENTO PRÁCTICO ============
  saludo: { 
    type: Number, 
    min: [1, 'La calificación mínima es 1'], 
    max: [4, 'La calificación máxima es 4'] 
  },
  
  presentacion: { 
    type: Number, 
    min: [1, 'La calificación mínima es 1'], 
    max: [4, 'La calificación máxima es 4'] 
  },
  
  asistencia: { 
    type: Number, 
    min: [1, 'La calificación mínima es 1'], 
    max: [4, 'La calificación máxima es 4'] 
  },
  
  estrategias: [{
    type: String,
    enum: {
      values: ['ABP', 'Trabajo en equipo', 'Prácticas', 'Ensayos'],
      message: 'Estrategia no válida'
    }
  }],
  
  comentariosTecnicos: { 
    type: String,
    maxlength: [500, 'Los comentarios no pueden exceder 500 caracteres']
  },

  // ============ OBSERVACIONES FINALES ============
  dificultadesCompetencias: [{
    type: String,
    enum: {
      values: [
        'Ninguna dificultad',
        'Evaluación de módulos formativos',
        'Desconocimiento de planificación por competencia',
        'Dificultad con planilla de planificación',
        'Dificultad con registro de grado',
        'Desconocimiento de ordenanzas curriculares'
      ],
      message: 'Opción no válida para dificultades de competencias'
    }
  }],
  
  observaciones: { 
    type: String,
    required: [true, 'Las observaciones son requeridas'],
    maxlength: [1000, 'Las observaciones no pueden exceder 1000 caracteres']
  },
  
  accionesMejora: { 
    type: String,
    required: [true, 'Las acciones de mejora son requeridas'],
    maxlength: [1000, 'Las acciones no pueden exceder 1000 caracteres']
  },

  // ============ METADATOS ============
  usuario: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: [true, 'El usuario es requerido']
  },
  
  calificacion: { 
    type: Number, 
    min: [0, 'La calificación mínima es 0'], 
    max: [100, 'La calificación máxima es 100'], 
    default: 0 
  },
  
  asignatura: { 
    type: String,
    required: [true, 'La asignatura es requerida'],
    maxlength: [100, 'La asignatura no puede exceder 100 caracteres']
  },
  
  tipo: { 
    type: String, 
    default: 'acompañamiento',
    enum: {
      values: ['acompañamiento', 'seguimiento', 'evaluación'],
      message: 'Tipo de evaluación no válido'
    }
  },
  
  creadoEn: { 
    type: Date, 
    default: Date.now,
    immutable: true 
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices para mejorar performance de búsquedas
EvaluacionSchema.index({ docente: 1 });
EvaluacionSchema.index({ coordinador: 1 });
EvaluacionSchema.index({ fecha: 1 });
EvaluacionSchema.index({ asignatura: 1 });

// Virtual para mostrar nombre completo
EvaluacionSchema.virtual('nombreEvaluacion').get(function() {
  return `${this.asignatura} - ${this.fecha.toLocaleDateString()}`;
});

// Middleware para validación adicional
EvaluacionSchema.pre('save', function(next) {
  if (this.fecha && new Date(this.fecha) > new Date()) {
    throw new Error('La fecha de evaluación no puede ser futura');
  }
  next();
});

module.exports = mongoose.model('Evaluacion', EvaluacionSchema);