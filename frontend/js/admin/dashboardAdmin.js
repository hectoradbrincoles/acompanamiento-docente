// 📁 frontend/js/admin/dashboardAdmin.js

// Mapa de rutas para las páginas del admin
const adminRoutes = {
  'dashboard': {
    html: '../pages/admin/dashboardAdmin.html',
    js: '../../js/dashboardAdmin.js'
  },
  'usuarios': {
    html: '../pages/usuarios.html',
    js: '../../js/usuarios.js'
  },
  'asignaturas': {
    html: '../pages/asignaturas.html',
    js: '../../js/asignaturas.js'
  },
  'especialidades': {
    html: '../pages/especialidades.html',
    js: '../../js/especialidades.js'
  },
  'periodos': {
    html: '../pages/periodos.html',
    js: '../../js/periodos.js'
  },
  'centros': {
    html: '../pages/centros.html',
    js: '../../js/centros.js'
  },
  'criterios': {
    html: '../pages/criterios.html',
    js: '../../js/criterios.js'
  },
  'asignar-docentes': {
    html: '../pages/admin/asignar-docentes.html',
    js: '../../js/asignar-docentes.js'
  },
  'reportes': {
    html: '../pages/reportes.html',
    js: '../../js/reportes.js'
  }
};

// Función para mostrar/ocultar el spinner de carga
function toggleLoading(show) {
  document.getElementById('loadingSpinner').style.display = show ? 'block' : 'none';
}

// Función para cargar contenido dinámico
async function cargarContenido(pagina) {
  try {
    toggleLoading(true);
    
    // Si es el dashboard, recargamos la página completa
    if (pagina === 'dashboard') {
      window.location.href = adminRoutes.dashboard.html;
      return;
    }

    // Verificar si la ruta existe
    if (!adminRoutes[pagina]) {
      throw new Error(`Página ${pagina} no encontrada`);
    }

    // Actualizar clase active en el sidebar
    document.querySelectorAll('.sidebar a').forEach(link => {
      link.classList.remove('active');
      if (link.textContent.includes(getIconoPagina(pagina))) {
        link.classList.add('active');
      }
    });

    // Cargar el contenido HTML
    const response = await fetch(adminRoutes[pagina].html);
    if (!response.ok) throw new Error('Error al cargar la página');
    
    const html = await response.text();
    document.getElementById('contenido-dinamico').innerHTML = html;

    // Cargar el JS correspondiente
    await cargarScript(adminRoutes[pagina].js);
    
  } catch (error) {
    console.error('Error al cargar contenido:', error);
    document.getElementById('contenido-dinamico').innerHTML = `
      <div class="alert alert-danger">
        <h5>Error al cargar la página</h5>
        <p>${error.message}</p>
        <button onclick="cargarContenido('dashboard')" class="btn btn-primary">
          Volver al Dashboard
        </button>
      </div>
    `;
  } finally {
    toggleLoading(false);
  }
}

// Función auxiliar para obtener el icono de la página
function getIconoPagina(pagina) {
  const iconos = {
    'dashboard': '📊',
    'usuarios': '👥',
    'asignaturas': '📘',
    'especialidades': '🧪',
    'periodos': '📅',
    'centros': '🏫',
    'criterios': '📝',
    'asignar-docentes': '🎯',
    'reportes': '📈'
  };
  return iconos[pagina] || '';
}

// Función para cargar scripts dinámicamente
function cargarScript(src) {
  return new Promise((resolve, reject) => {
    // Eliminar script anterior si existe
    const scriptExistente = document.querySelector(`script[src="${src}"]`);
    if (scriptExistente) {
      scriptExistente.remove();
    }

    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`Error al cargar el script: ${src}`));
    document.body.appendChild(script);
  });
}

// Función para cerrar sesión
function cerrarSesion() {
  localStorage.removeItem('token');
  window.location.href = '../pages/login.html';
}

// Cargar dashboard al iniciar
document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '../pages/login.html';
    return;
  }

  try {
    // Obtener perfil del administrador
    const resAdmin = await fetch('http://localhost:4000/api/auth/perfil', {
      headers: { Authorization: 'Bearer ' + token },
    });

    if (!resAdmin.ok) throw new Error('No se pudo obtener el perfil del administrador.');
    const admin = await resAdmin.json();
    document.getElementById('adminNombre').textContent = admin.nombre || 'Administrador';

    // Cargar estadísticas iniciales
    await cargarEstadisticas();

  } catch (error) {
    console.error('Error al cargar datos iniciales:', error);
    document.getElementById('contenido-dinamico').innerHTML = `
      <div class="alert alert-danger">
        <h5>Error al cargar datos iniciales</h5>
        <p>${error.message}</p>
      </div>
    `;
  }
});

// Función para cargar estadísticas
async function cargarEstadisticas() {
  try {
    const token = localStorage.getItem('token');
    const resStats = await fetch('http://localhost:4000/api/admin/estadisticas', {
      headers: { Authorization: 'Bearer ' + token },
    });

    if (!resStats.ok) throw new Error('No se pudieron obtener las estadísticas.');
    const stats = await resStats.json();

    // Actualizar tarjetas
    document.getElementById('totalUsuarios').textContent = stats.totalUsuarios || 0;
    document.getElementById('totalDocentes').textContent = stats.totalDocentes || 0;
    document.getElementById('totalEvaluaciones').textContent = stats.totalEvaluaciones || 0;
    document.getElementById('totalObservaciones').textContent = stats.totalObservaciones || 0;

    // Configurar gráficos
    new Chart(document.getElementById('graficoDesempeno'), {
      type: 'bar',
      data: {
        labels: stats.desempeno?.map(d => d.nombre) || [],
        datasets: [{
          label: 'Promedio General',
          data: stats.desempeno?.map(d => d.promedio) || [],
          backgroundColor: '#0d6efd',
        }],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } },
      },
    });

    new Chart(document.getElementById('graficoAsignaturas'), {
      type: 'doughnut',
      data: {
        labels: stats.asignaturas?.map(a => a.nombre) || [],
        datasets: [{
          data: stats.asignaturas?.map(a => a.cantidad) || [],
          backgroundColor: ['#0d6efd', '#198754', '#ffc107', '#dc3545', '#6f42c1'],
        }],
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'bottom' } },
      },
    });

  } catch (error) {
    console.error('Error al cargar estadísticas:', error);
    throw error;
  }
}