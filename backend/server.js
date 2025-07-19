// 📁 backend/server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => res.send('API de Evaluación Docente funcionando 🎓'));

// 📌 Rutas principales
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/evaluaciones', require('./routes/evaluacionRoutes'));
app.use('/api/reportes', require('./routes/reportesRoutes'));
app.use('/api/usuarios', require('./routes/usuarioRoutes'));
app.use('/api/coordinador', require('./routes/coordinadorRoutes'));
app.use('/api/docentes', require('./routes/docenteRoutes'));
app.use('/api/asignaciones', require('./routes/asignacionRoutes'));
app.use('/api/asignaturas', require('./routes/asignaturaRoutes')); 
app.use('/api/especialidades', require('./routes/especialidadRoutes'));
app.use('/api/periodos', require('./routes/periodoRoutes'));
app.use('/api/centros', require('./routes/centroRoutes'));
app.use('/api/criterios', require('./routes/criterioRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/departamentos', require('./routes/departamentoRoutes'));
app.use('/api/preguntas', require('./routes/preguntaRoutes'));

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tesis_evaluacion')
  .then(() => {
    console.log('✅ Conexión a MongoDB exitosa');
    app.listen(PORT, () => console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('❌ Error al conectar a MongoDB:', err);
  });
