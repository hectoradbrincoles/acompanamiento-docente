const API = 'http://localhost:4000/api/periodos';
const form = document.getElementById('formPeriodo');
const lista = document.getElementById('listaPeriodos');
const btnCancelar = document.getElementById('btnCancelar');

let modoEdicion = false;
let idActual = null;

document.addEventListener('DOMContentLoaded', obtenerPeriodos);

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const nombre = document.getElementById('nombre').value.trim();
  const fechaInicio = document.getElementById('fechaInicio').value;
  const fechaFin = document.getElementById('fechaFin').value;

  try {
    const res = await fetch(modoEdicion ? `${API}/${idActual}` : API, {
      method: modoEdicion ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, fechaInicio, fechaFin })
    });

    if (!res.ok) throw new Error('Error al guardar el período');

    form.reset();
    obtenerPeriodos();
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

async function obtenerPeriodos() {
  lista.innerHTML = '';
  const res = await fetch(API);
  const data = await res.json();

  data.forEach(p => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${p.nombre}</td>
      <td>${p.fechaInicio.slice(0, 10)}</td>
      <td>${p.fechaFin.slice(0, 10)}</td>
      <td>
        <button class="btn btn-warning btn-sm me-2" onclick="editar('${p._id}', '${p.nombre}', '${p.fechaInicio.slice(0, 10)}', '${p.fechaFin.slice(0, 10)}')">Editar</button>
        <button class="btn btn-danger btn-sm" onclick="eliminar('${p._id}')">Eliminar</button>
      </td>
    `;
    lista.appendChild(row);
  });
}

function editar(id, nombre, fechaInicio, fechaFin) {
  document.getElementById('nombre').value = nombre;
  document.getElementById('fechaInicio').value = fechaInicio;
  document.getElementById('fechaFin').value = fechaFin;

  modoEdicion = true;
  idActual = id;
  btnCancelar.classList.remove('d-none');
}

async function eliminar(id) {
  if (!confirm('¿Eliminar este período académico?')) return;
  const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
  if (res.ok) obtenerPeriodos();
}
