// ✅ js/docente/evaluaciones.js - Evaluaciones recibidas del docente

import { decodificarToken } from '../utils/auth.js';
import api from '../../axiosConfig.js';

let evaluaciones = [];

// 📥 Cargar evaluaciones del docente
const cargarEvaluaciones = async () => {
  try {
    const res = await api.get('/docentes/evaluaciones'); 
    evaluaciones = res.data;
    mostrarEvaluaciones(evaluaciones);
  } catch (error) {
    console.error('❌ Error al cargar evaluaciones:', error);
    document.getElementById('tablaEvaluaciones').innerHTML =
      '<tr><td colspan="6">Error al cargar los datos.</td></tr>';
  }
};

// 📊 Mostrar evaluaciones en tabla
const mostrarEvaluaciones = (datos) => {
  const tabla = document.getElementById('tablaEvaluaciones');
  tabla.innerHTML = '';

  if (datos.length === 0) {
    tabla.innerHTML = '<tr><td colspan="6">No se han recibido evaluaciones.</td></tr>';
    return;
  }

  datos.forEach((ev, index) => {
    const fila = `
      <tr>
        <td>${index + 1}</td>
        <td>${new Date(ev.fecha).toLocaleDateString()}</td>
        <td>${ev.asignatura}</td>
        <td>${ev.centroEducativo}</td>
        <td><span class="badge bg-success">${ev.puntaje}</span></td>
        <td>${ev.coordinador?.nombre || 'Desconocido'}</td>
      </tr>
    `;
    tabla.innerHTML += fila;
  });
};

// 🔍 Aplicar filtros
const aplicarFiltros = () => {
  const asignatura = document.getElementById('filtroAsignatura').value.toLowerCase();
  const desde = document.getElementById('filtroDesde').value;
  const hasta = document.getElementById('filtroHasta').value;

  const filtradas = evaluaciones.filter(ev => {
    const asignaturaCoincide = ev.asignatura?.toLowerCase().includes(asignatura);
    const fechaEv = new Date(ev.fecha);
    const desdeOk = desde ? fechaEv >= new Date(desde) : true;
    const hastaOk = hasta ? fechaEv <= new Date(hasta) : true;
    return asignaturaCoincide && desdeOk && hastaOk;
  });

  mostrarEvaluaciones(filtradas);
};

// 🎯 Inicializar eventos
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btnFiltrar').addEventListener('click', aplicarFiltros);
  cargarEvaluaciones();

  // Cargar footer
  fetch('/pages/footer.html')
    .then(res => res.text())
    .then(html => {
      document.getElementById('footer-container').innerHTML = html;
    });
});
