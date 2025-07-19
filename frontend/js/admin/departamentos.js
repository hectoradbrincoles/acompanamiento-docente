const API_URL = "http://localhost:4000";
const tablaBody = document.querySelector('#tablaDepartamentos tbody');
const form = document.getElementById('formDepartamento');
const modal = new bootstrap.Modal(document.getElementById('modalDepartamento'));

let departamentos = [];

// ✅ Cargar departamentos desde la API
async function cargarDepartamentos() {
  try {
    const res = await fetch(`${API_URL}/api/departamentos`);
    departamentos = await res.json();
    mostrarDepartamentos();
  } catch (error) {
    console.error('Error al cargar departamentos:', error);
  }
}

// ✅ Mostrar los departamentos en la tabla
function mostrarDepartamentos() {
  tablaBody.innerHTML = '';
  departamentos.forEach((dep, index) => {
    tablaBody.innerHTML += `
      <tr>
        <td>${index + 1}</td>
        <td>${dep.nombre}</td>
        <td>${dep.descripcion || ''}</td>
        <td>
          <button class="btn btn-sm btn-warning me-2" onclick="editarDepartamento('${dep._id}')">
            <i class="bi bi-pencil-square"></i>
          </button>
          <button class="btn btn-sm btn-danger" onclick="eliminarDepartamento('${dep._id}')">
            <i class="bi bi-trash-fill"></i>
          </button>
        </td>
      </tr>
    `;
  });
}

// ✅ Crear o actualizar un departamento
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const nombre = document.getElementById('nombre').value;
  const descripcion = document.getElementById('descripcion').value;
  const id = document.getElementById('departamentoId').value;

  const datos = { nombre, descripcion };

  try {
    if (id) {
      // Actualizar
      await fetch(`${API_URL}/api/departamentos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
      });
    } else {
      // Crear nuevo
      await fetch(`${API_URL}/api/departamentos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
      });
    }

    form.reset();
    modal.hide();
    cargarDepartamentos();
  } catch (error) {
    console.error('Error al guardar departamento:', error);
  }
});

// ✅ Eliminar departamento
async function eliminarDepartamento(id) {
  if (confirm('¿Estás seguro de eliminar este departamento?')) {
    try {
      await fetch(`${API_URL}/api/departamentos/${id}`, { method: 'DELETE' });
      cargarDepartamentos();
    } catch (error) {
      console.error('Error al eliminar departamento:', error);
    }
  }
}

// ✅ Cargar los datos al formulario de edición
function editarDepartamento(id) {
  const dep = departamentos.find((d) => d._id === id);
  document.getElementById('nombre').value = dep.nombre;
  document.getElementById('descripcion').value = dep.descripcion;
  document.getElementById('departamentoId').value = dep._id;
  modal.show();
}

// ✅ Inicializar al cargar
cargarDepartamentos();
