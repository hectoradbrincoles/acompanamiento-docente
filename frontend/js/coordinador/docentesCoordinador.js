const API_URL = 'http://localhost:4000';
const tablaBody = document.getElementById('tablaDocentes');

// 🔐 Verificar token del coordinador
const token = localStorage.getItem('token');
if (!token) {
  alert('Sesión expirada. Vuelve a iniciar sesión.');
  window.location.href = '../../login.html';
}

// 📄 Cerrar sesión
function cerrarSesion() {
  localStorage.removeItem('token');
  window.location.href = '../../login.html';
}

// 🔄 Obtener docentes asignados al coordinador
async function cargarDocentesAsignados() {
  try {
    const res = await fetch(`${API_URL}/api/coordinador/docentes`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!res.ok) {
      throw new Error('Error al obtener los docentes.');
    }

    const docentes = await res.json();
    renderizarDocentes(docentes);
  } catch (error) {
    console.error('❌ Error:', error);
    alert('No se pudo cargar la lista de docentes.');
  }
}

// 📊 Renderizar tabla
function renderizarDocentes(docentes) {
  tablaBody.innerHTML = '';

  if (docentes.length === 0) {
    tablaBody.innerHTML = `<tr><td colspan="6" class="text-center">No hay docentes asignados.</td></tr>`;
    return;
  }

  docentes.forEach((docente, index) => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${index + 1}</td>
      <td>${docente.nombre}</td>
      <td>${docente.usuario}</td>
      <td>${docente.correo}</td>
      <td>${docente.especialidad || 'N/A'}</td>
      <td><a href="#" class="btn btn-sm btn-primary disabled">Ver Evaluaciones</a></td>
    `;
    tablaBody.appendChild(fila);
  });
}

// 🚀 Al cargar la página
document.addEventListener('DOMContentLoaded', cargarDocentesAsignados);
