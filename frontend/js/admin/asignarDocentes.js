// 📁 frontend/js/admin/asignarDocentes.js

document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  if (!token) return window.location.href = '/pages/login.html';

  const listaCoordinadores = document.getElementById('coordinador');
  const listaDocentes = document.getElementById('listaDocentes');
  const mensaje = document.getElementById('mensaje');

  // 🔄 Cargar Coordinadores
  async function cargarCoordinadores() {
    try {
      const res = await fetch('http://localhost:4000/api/asignaciones/coordinadores', {
        headers: { Authorization: 'Bearer ' + token }
      });

      const coordinadores = await res.json();

      listaCoordinadores.innerHTML = '<option value="">-- Elige un coordinador --</option>';
      coordinadores.forEach(coord => {
        const option = document.createElement('option');
        option.value = coord._id;
        option.textContent = coord.nombre;
        listaCoordinadores.appendChild(option);
      });
    } catch (error) {
      console.error('❌ Error al cargar coordinadores:', error);
    }
  }

  // 🔄 Cargar Docentes
  async function cargarDocentes() {
    try {
      const res = await fetch('http://localhost:4000/api/asignaciones/docentes', {
        headers: { Authorization: 'Bearer ' + token }
      });

      const docentes = await res.json();
      listaDocentes.innerHTML = ''; // limpia contenedor

      if (!Array.isArray(docentes) || docentes.length === 0) {
        listaDocentes.innerHTML = '<p class="text-muted">No hay docentes disponibles.</p>';
        return;
      }

      docentes.forEach(doc => {
        const div = document.createElement('div');
        div.className = 'col-12 col-md-6';

        const asignado = doc.coordinadorAsignado
          ? ` <span class="badge bg-secondary">Asignado a ${doc.coordinadorAsignado.nombre}</span>`
          : '';

        div.innerHTML = `
          <div class="form-check">
            <input class="form-check-input" type="checkbox" value="${doc._id}" id="doc-${doc._id}" ${doc.coordinadorAsignado ? 'disabled' : ''}>
            <label class="form-check-label" for="doc-${doc._id}">
              ${doc.nombre} ${asignado}
            </label>
          </div>
        `;
        listaDocentes.appendChild(div);
      });

    } catch (error) {
      console.error('❌ Error al cargar docentes:', error);
    }
  }

  // ✅ Asignar docentes al coordinador
  window.asignarDocentes = async () => {
    const coordinadorId = listaCoordinadores.value;
    const docentesSeleccionados = Array.from(
      listaDocentes.querySelectorAll('input[type="checkbox"]:checked')
    ).map(input => input.value);

    mensaje.innerHTML = '';
    if (!coordinadorId || docentesSeleccionados.length === 0) {
      mensaje.innerHTML = '<div class="alert alert-warning">⚠️ Selecciona un coordinador y al menos un docente.</div>';
      return;
    }

    try {
      const res = await fetch('http://localhost:4000/api/asignaciones/asignar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        },
        body: JSON.stringify({ coordinadorId, docentesIds: docentesSeleccionados })
      });

      const data = await res.json();
      if (res.ok) {
        mensaje.innerHTML = '<div class="alert alert-success">✅ Docentes asignados correctamente.</div>';
        await cargarDocentes(); // refrescar la lista
      } else {
        mensaje.innerHTML = `<div class="alert alert-danger">❌ ${data.error || 'Error desconocido.'}</div>`;
      }
    } catch (error) {
      console.error('❌ Error al asignar docentes:', error);
      mensaje.innerHTML = '<div class="alert alert-danger">❌ Error de conexión al servidor.</div>';
    }
  };

  await cargarCoordinadores();
  await cargarDocentes();
});
