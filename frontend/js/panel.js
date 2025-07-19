// frontend/js/panel.js

// Función para pedir los datos del panel al backend
async function cargarPanel() {
  const token = localStorage.getItem('token');
  if (!token) {
    // Si no hay token, redirige al login
    window.location.href = 'login.html';
    return;
  }

  // Puedes crear un endpoint en el backend para estos datos resumidos
  try {
    const res = await fetch('http://localhost:4000/api/reportes/resumen', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    if (!res.ok) throw new Error('No autorizado o error en el servidor');
    const data = await res.json();

    // Actualiza los contadores
    document.getElementById('totalDocentes').textContent = data.totalDocentes || 0;
    document.getElementById('totalEvaluaciones').textContent = data.totalEvaluaciones || 0;
    document.getElementById('totalReportes').textContent = data.totalReportes || 0;

    // Si quieres el gráfico dinámico:
    if (data.evaluacionesPorMes) {
      cargarGraficoEvaluaciones(data.evaluacionesPorMes);
    }
  } catch (err) {
    // Si falla, muestra valores por defecto
    document.getElementById('totalDocentes').textContent = '0';
    document.getElementById('totalEvaluaciones').textContent = '0';
    document.getElementById('totalReportes').textContent = '0';
    cargarGraficoEvaluaciones([0,0,0,0,0,0,0,0,0,0,0,0]);
    // Puedes mostrar un mensaje de error si quieres
    // alert('No se pudo cargar el panel');
  }
}

// Función para el gráfico con Chart.js
function cargarGraficoEvaluaciones(datos) {
  const ctx = document.getElementById('evaluacionesChart').getContext('2d');
  // Si ya hay un gráfico, destrúyelo antes de crear uno nuevo
  if (window.chartEvaluaciones) window.chartEvaluaciones.destroy();

  window.chartEvaluaciones = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      datasets: [{
        label: 'Evaluaciones',
        data: datos,
        backgroundColor: 'rgba(54, 162, 235, 0.6)'
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } }
    }
  });
}

// Nombre y bienvenida desde localStorage
function ponerNombreUsuario() {
  document.getElementById('nombreUsuario').textContent = localStorage.getItem('nombre') || 'admin';
  document.getElementById('bienvenida-usuario').textContent = '¡Bienvenido, ' + (localStorage.getItem('nombre') || 'Administrador') + '!';
}

// Cerrar sesión (ambos botones)
function activarCerrarSesion() {
  document.getElementById('cerrarSesionBtn').onclick = function() {
    localStorage.clear();
    window.location.href = 'login.html';
  };
  document.getElementById('cerrarSesionSidebar').onclick = function() {
    localStorage.clear();
    window.location.href = 'login.html';
  };
}

// Al cargar la página
document.addEventListener('DOMContentLoaded', function() {
  ponerNombreUsuario();
  cargarPanel();
  activarCerrarSesion();
});
