// 📄 frontend/js/docente/inicio.js
import { decodificarToken } from '../utils/auth.js';
import api from '../../axiosConfig.js';

const decoded = decodificarToken();
const nombre = decoded?.nombre || 'Docente';
document.getElementById('docenteNombre').textContent = nombre;

// ✅ Cargar estadísticas desde backend
const cargarEstadisticas = async () => {
  try {
    const res = await api.get('/docentes/dashboard');
    const { totalEvaluaciones, ultimaCalificacion, ultimaFecha, calificaciones, evaluacionesMensuales } = res.data;

    document.getElementById('totalEvaluaciones').textContent = totalEvaluaciones;
    document.getElementById('ultimaCalificacion').textContent = ultimaCalificacion;
    document.getElementById('ultimaFecha').textContent = ultimaFecha;

    // 📈 Calificaciones recientes
    const ctx1 = document.getElementById('graficoCalificaciones').getContext('2d');
    new Chart(ctx1, {
      type: 'line',
      data: {
        labels: calificaciones.map(e => e.mes),
        datasets: [{
          label: 'Calificación',
          data: calificaciones.map(e => e.valor),
          borderColor: '#4e73df',
          backgroundColor: 'rgba(78, 115, 223, 0.2)',
          fill: true,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        scales: { y: { beginAtZero: true, max: 100 } }
      }
    });

    // 📊 Evaluaciones por mes
    const ctx2 = document.getElementById('graficoEvaluaciones').getContext('2d');
    new Chart(ctx2, {
      type: 'bar',
      data: {
        labels: evaluacionesMensuales.map(e => e.mes),
        datasets: [{
          label: 'Evaluaciones',
          data: evaluacionesMensuales.map(e => e.total),
          backgroundColor: '#1cc88a'
        }]
      },
      options: {
        responsive: true,
        scales: { y: { beginAtZero: true, precision: 0 } }
      }
    });

  } catch (error) {
    console.error('❌ Error al cargar estadísticas:', error);
  }
};

cargarEstadisticas();

// Footer
fetch('/pages/footer.html')
  .then(res => res.text())
  .then(html => {
    document.getElementById('footer-container').innerHTML = html;
  });
