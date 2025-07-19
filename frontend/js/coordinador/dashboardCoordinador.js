const API_URL = 'http://localhost:4000';
const token = localStorage.getItem('token');

// ✅ Validar sesión al cargar
if (!token) {
  alert('⚠️ Sesión expirada. Por favor inicia sesión nuevamente.');
  window.location.href = `${window.location.origin}/pages/login.html`;
}

document.addEventListener('DOMContentLoaded', () => {
  cargarPerfil();
  cargarCantidadDocentes();
});

// ✅ Cargar datos del coordinador
async function cargarPerfil() {
  try {
    const res = await fetch(`${API_URL}/api/auth/perfil`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!res.ok) throw new Error('No autorizado');

    const usuario = await res.json();
    const nombreUsuario = document.getElementById('coordinadorNombre');
    if (nombreUsuario && usuario?.nombre) {
      nombreUsuario.textContent = usuario.nombre;
    } else {
      console.warn('⚠️ El elemento "coordinadorNombre" no está disponible o el nombre es inválido.');
    }

  } catch (error) {
    console.error('❌ Error al obtener perfil:', error);
    alert('No se pudo obtener la información del coordinador.');
    window.location.href = `${window.location.origin}/pages/login.html`;
  }
}

// ✅ Cargar cantidad de docentes asignados
async function cargarCantidadDocentes() {
  try {
    const res = await fetch(`${API_URL}/api/coordinador/docentes`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!res.ok) throw new Error('Error al contar docentes');

    const docentes = await res.json();
    const totalDocentes = document.getElementById('totalDocentes');
    if (totalDocentes) totalDocentes.textContent = docentes.length;
  } catch (error) {
    console.error('❌ Error al contar docentes:', error);
    const totalDocentes = document.getElementById('totalDocentes');
    if (totalDocentes) totalDocentes.textContent = '—';
  }
}

// ✅ Cerrar sesión y redirigir de forma segura
function cerrarSesion() {
  localStorage.removeItem('token');
  window.location.href = `${window.location.origin}/pages/login.html`;
}
