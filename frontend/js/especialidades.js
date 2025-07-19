const API = 'http://localhost:4000/api/especialidades';
const form = document.getElementById('formEspecialidad');
const lista = document.getElementById('listaEspecialidades');
const btnCancelar = document.getElementById('btnCancelar');

let modoEdicion = false;
let idActual = null;

document.addEventListener('DOMContentLoaded', obtenerEspecialidades);

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const codigo = document.getElementById('codigo').value.trim();
  const nombre = document.getElementById('nombre').value.trim();

  try {
    const res = await fetch(modoEdicion ? `${API}/${idActual}` : API, {
      method: modoEdicion ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ codigo, nombre })
    });

    if (!res.ok) throw new Error('Error al guardar');

    form.reset();
    obtenerEspecialidades();
    cancelarEdicion();
  } catch (err) {
    alert(err.message);
  }
});

btnCancelar.addEventListener('click', cancelarEdicion);

function cancelarEdicion() {
  modoEdicion = false;
  idActual = null;
  form.reset();
  btnCancelar.classList.add('d-none');
}

async function obtenerEspecialidades() {
  lista.innerHTML = '';
  const res = await fetch(API);
  const data = await res.json();

  data.forEach(e => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${e.codigo}</td>
      <td>${e.nombre}</td>
      <td>
        <button class="btn btn-warning btn-sm me-2" onclick="editar('${e._id}', '${e.codigo}', '${e.nombre}')">Editar</button>
        <button class="btn btn-danger btn-sm" onclick="eliminar('${e._id}')">Eliminar</button>
      </td>
    `;
    lista.appendChild(row);
  });
}

function editar(id, codigo, nombre) {
  document.getElementById('codigo').value = codigo;
  document.getElementById('nombre').value = nombre;
  modoEdicion = true;
  idActual = id;
  btnCancelar.classList.remove('d-none');
}

async function eliminar(id) {
  if (!confirm('¿Eliminar esta especialidad?')) return;
  const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
  if (res.ok) obtenerEspecialidades();
}
