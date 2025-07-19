// 📁 frontend/js/coordinador/docentes.js

const API_URL = 'http://localhost:4000';
const token = localStorage.getItem('token');

// 🔐 Verificar sesión
if (!token) {
  alert('⚠️ Tu sesión ha expirado. Inicia sesión nuevamente.');
  window.location.href = '../../login.html';
}

document.addEventListener("DOMContentLoaded", () => {
  cargarDocentes();
  cargarDatosDocenteDesdeFormulario(); // ✅ Llamada para prellenar formulario si aplica
});

async function cargarDocentes() {
  const tbody = document.querySelector("#tablaDocentes");

  try {
    const res = await fetch(`${API_URL}/api/coordinador/docentes`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error('No autorizado o error en el servidor');

    const docentes = await res.json();

    if (!Array.isArray(docentes)) {
      console.warn('❌ La respuesta no es una lista válida:', docentes);
      throw new Error('Formato inesperado en la respuesta');
    }

    // Limpiar tabla
    tbody.innerHTML = "";

    // Renderizar filas con botón "Evaluar"
    docentes.forEach((doc, index) => {
      const fila = `
        <tr>
          <td class="text-center">${index + 1}</td>
          <td>${doc.nombre}</td>
          <td>${doc.area || '<span class="text-muted">No especificada</span>'}</td>
          <td>${doc.correo}</td>
          <td class="text-center">
            <a href="../../pages/formulario.html?id=${doc._id}" class="btn btn-sm btn-success">
              Evaluar
            </a>
          </td>
        </tr>
      `;
      tbody.insertAdjacentHTML("beforeend", fila);
    });

  } catch (err) {
    console.error("❌ Error al cargar docentes:", err);
    tbody.innerHTML = `<tr><td colspan="5" class="text-center text-danger">❌ Error al obtener los datos.</td></tr>`;
  }
}

// ✅ Función adicional para autocompletar datos en el formulario (cuando hay ?id=...)
async function cargarDatosDocenteDesdeFormulario() {
  const params = new URLSearchParams(window.location.search);
  const docenteId = params.get('id');
  if (!docenteId) return;

  try {
    const res = await fetch(`${API_URL}/api/docentes/${docenteId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error('No se pudo obtener la información del docente');

    const docente = await res.json();

    // Autocompletar campos del formulario (solo si existen en el HTML)
    document.querySelector('input[name="docente"]')?.setAttribute('value', docente.nombre || '');
    document.querySelector('input[name="correoInstitucional"]')?.setAttribute('value', docente.correo || '');
    document.querySelector('input[name="coordinador"]')?.setAttribute('value', docente.coordinadorAsignado?.nombre || '');
    document.querySelector('input[name="correoCoordinador"]')?.setAttribute('value', docente.coordinadorAsignado?.correo || '');

    console.log('✅ Datos del docente cargados correctamente.');
  } catch (error) {
    console.error('❌ Error al cargar los datos del docente:', error.message);
  }
}
