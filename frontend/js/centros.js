const API = 'http://localhost:4000/api/centros';
const form = document.getElementById('formCentro');
const lista = document.getElementById('listaCentros');
const btnCancelar = document.getElementById('btnCancelar');

let modoEdicion = false;
let idActual = null;

document.addEventListener('DOMContentLoaded', obtenerCentros);

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const codigo = document.getElementById('codigo').value.trim();
  const nombre = document.getElementById('nombre').value.trim();
  const direccion = document.getElementById('direccion').value.trim();
  const regional = document.getElementById('regional').value.trim();

  try {
    const res = await fetch(modoEdicion ? `${API}/${idActual}` : API, {
      method: modoEdicion ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ codigo, nombre, direccion, regional })
    });

    if (!res.ok) throw new Error('Error al guardar centro');
    form.reset();
    obtenerCentros();
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

async function obtenerCentros() {
  lista.innerHTML = '';
  const res = await fetch(API);
  const data = await res.json();

  data.forEach(c => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${c.codigo}</td>
      <td>${c.nombre}</td>
      <td>${c.direccion}</td>
      <td>${c.regional}</td>
      <td>
        <button class="btn btn-warning btn-sm me-2" onclick="editar('${c._id}', '${c.codigo}', '${c.nombre}', '${c.direccion}', '${c.regional}')">Editar</button>
        <button class="btn btn-danger btn-sm" onclick="eliminar('${c._id}')">Eliminar</button>
      </td>
    `;
    lista.appendChild(row);
  });
}

function editar(id, codigo, nombre, direccion, regional) {
  document.getElementById('codigo').value = codigo;
  document.getElementById('nombre').value = nombre;
  document.getElementById('direccion').value = direccion;
  document.getElementById('regional').value = regional;

  modoEdicion = true;
  idActual = id;
  btnCancelar.classList.remove('d-none');
}

async function eliminar(id) {
  if (!confirm('¿Eliminar este centro educativo?')) return;
  const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
  if (res.ok) obtenerCentros();
}
