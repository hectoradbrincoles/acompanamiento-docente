// 📁 frontend/js/asignaturas.js

document.addEventListener('DOMContentLoaded', () => {
  const URL_API = 'http://localhost:4000/api/asignaturas';
  const formAsignatura = document.getElementById('formAsignatura');
  const listaAsignaturas = document.getElementById('listaAsignaturas');
  const btnCancelar = document.getElementById('btnCancelar');

  let modoEdicion = false;
  let idActual = null;

  obtenerAsignaturas();

  // Enviar formulario
  formAsignatura.addEventListener('submit', async (e) => {
    e.preventDefault();

    const codigo = document.getElementById('codigo').value.trim();
    const nombre = document.getElementById('nombre').value.trim();
    const creditos = parseInt(document.getElementById('creditos').value);

    try {
      const opcionesFetch = {
        method: modoEdicion ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo, nombre, creditos })
      };

      const url = modoEdicion ? `${URL_API}/${idActual}` : URL_API;
      const res = await fetch(url, opcionesFetch);
      if (!res.ok) throw new Error('Error al guardar asignatura');

      formAsignatura.reset();
      obtenerAsignaturas();
      cancelarEdicion();
    } catch (err) {
      alert(err.message);
      console.error(err);
    }
  });

  // Cargar para editar
  window.cargarParaEditar = function (id, codigo, nombre, creditos) {
    document.getElementById('codigo').value = codigo;
    document.getElementById('nombre').value = nombre;
    document.getElementById('creditos').value = creditos;

    modoEdicion = true;
    idActual = id;

    btnCancelar.classList.remove('d-none');
  };

  // Cancelar edición
  btnCancelar.addEventListener('click', cancelarEdicion);

  function cancelarEdicion() {
    modoEdicion = false;
    idActual = null;
    formAsignatura.reset();
    btnCancelar.classList.add('d-none');
  }

  // Eliminar asignatura
  window.eliminarAsignatura = async function (id) {
    if (!confirm('¿Deseas eliminar esta asignatura?')) return;
    try {
      const res = await fetch(`${URL_API}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('No se pudo eliminar');
      obtenerAsignaturas();
    } catch (err) {
      alert(err.message);
      console.error(err);
    }
  };

  // Obtener asignaturas
  async function obtenerAsignaturas() {
    listaAsignaturas.innerHTML = '';
    try {
      const res = await fetch(URL_API);
      const data = await res.json();

      data.forEach(asignatura => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${asignatura.codigo}</td>
          <td>${asignatura.nombre}</td>
          <td>${asignatura.creditos}</td>
          <td>
            <button class="btn btn-sm btn-warning me-2" onclick="cargarParaEditar('${asignatura._id}', '${asignatura.codigo}', '${asignatura.nombre}', ${asignatura.creditos})">Editar</button>
            <button class="btn btn-sm btn-danger" onclick="eliminarAsignatura('${asignatura._id}')">Eliminar</button>
          </td>
        `;
        listaAsignaturas.appendChild(tr);
      });
    } catch (err) {
      console.error('Error al cargar asignaturas:', err);
    }
  }
});
