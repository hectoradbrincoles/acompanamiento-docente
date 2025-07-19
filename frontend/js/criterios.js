// 📁 frontend/js/criterios.js
const API = 'http://localhost:4000/api/criterios';
const form = document.getElementById('formCriterio');
const lista = document.getElementById('listaCriterios');
const btnCancelar = document.getElementById('btnCancelar');
const inputPonderacionFinal = document.getElementById('ponderacionFinal');

let modoEdicion = false;
let idActual = null;

document.addEventListener('DOMContentLoaded', obtenerCriterios);
form.addEventListener('submit', guardarCriterio);
btnCancelar.addEventListener('click', cancelarEdicion);
inputPonderacionFinal.addEventListener('change', obtenerCriterios);

// Guardar o actualizar criterio
async function guardarCriterio(e) {
  e.preventDefault();

  const titulo = document.getElementById('titulo').value.trim();
  const descripcion = document.getElementById('descripcion').value.trim();

  if (!titulo) return alert('⚠️ El título es obligatorio.');

  try {
    const total = parseFloat(inputPonderacionFinal.value) || 100;
    const resGet = await fetch(API);
    const criteriosActuales = await resGet.json();
    const cantidadCriterios = modoEdicion ? criteriosActuales.length : criteriosActuales.length + 1;

    const ponderacion = cantidadCriterios > 0 ? (total / cantidadCriterios).toFixed(2) : total;

    const body = {
      titulo,
      descripcion,
      ponderacion: parseFloat(ponderacion),
      orden: cantidadCriterios // para orden visual si lo necesitas
    };

    const res = await fetch(modoEdicion ? `${API}/${idActual}` : API, {
      method: modoEdicion ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!res.ok) throw new Error('❌ Error al guardar el criterio.');

    form.reset();
    cancelarEdicion();
    obtenerCriterios();
  } catch (err) {
    alert(err.message);
  }
}

function cancelarEdicion() {
  modoEdicion = false;
  idActual = null;
  form.reset();
  btnCancelar.classList.add('d-none');
}

// Obtener criterios y calcular ponderación automática
async function obtenerCriterios() {
  lista.innerHTML = '';
  const total = parseFloat(inputPonderacionFinal.value) || 100;

  const res = await fetch(API);
  const data = await res.json();

  const ponderacionPorCriterio = data.length > 0 ? (total / data.length).toFixed(2) : 0;

  data.forEach(c => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${escapeHTML(c.titulo)}</td>
      <td>${escapeHTML(c.descripcion || '')}</td>
      <td>${ponderacionPorCriterio} pts</td>
      <td>
        <button class="btn btn-outline-primary btn-sm me-2" onclick="editar('${c._id}', '${escapeJS(c.titulo)}', '${escapeJS(c.descripcion)}')">
          <i class="bi bi-pencil"></i>
        </button>
        <button class="btn btn-outline-danger btn-sm me-2" onclick="eliminar('${c._id}')">
          <i class="bi bi-trash"></i>
        </button>
        <button class="btn btn-outline-secondary btn-sm" onclick="togglePreguntas('${c._id}')">
          <i class="bi bi-chevron-down"></i>
        </button>
      </td>
    `;
    lista.appendChild(row);

    const preguntaRow = document.createElement('tr');
    preguntaRow.id = `preguntas-${c._id}`;
    preguntaRow.style.display = 'none';
    preguntaRow.innerHTML = `
      <td colspan="4">
        <div class="p-2 border-start border-3 border-primary">
          <strong>Preguntas del criterio:</strong>
          <ul class="list-group mt-2" id="lista-preguntas-${c._id}">
            ${(c.preguntas || []).map(p => `
              <li class="list-group-item d-flex justify-content-between align-items-center">
                ${escapeHTML(p.texto)}
                <div>
                  <span class="badge bg-${p.evaluable ? 'success' : 'secondary'} me-2">${p.evaluable ? 'Califica' : 'No califica'}</span>
                  <button class="btn btn-outline-warning btn-sm me-1" onclick="editarPregunta('${p._id}', '${escapeJS(p.texto)}', ${p.evaluable})">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button class="btn btn-outline-danger btn-sm" onclick="eliminarPregunta('${p._id}', '${c._id}')">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </li>
            `).join('')}
          </ul>
          <button class="btn btn-sm btn-outline-success mt-2" onclick="agregarPregunta('${c._id}')">
            <i class="bi bi-plus-circle"></i> Agregar pregunta
          </button>
        </div>
      </td>
    `;
    lista.appendChild(preguntaRow);
  });
}

function togglePreguntas(criterioId) {
  const fila = document.getElementById(`preguntas-${criterioId}`);
  if (fila) fila.style.display = fila.style.display === 'none' ? 'table-row' : 'none';
}

function editar(id, titulo, descripcion) {
  document.getElementById('titulo').value = titulo;
  document.getElementById('descripcion').value = descripcion;

  modoEdicion = true;
  idActual = id;
  btnCancelar.classList.remove('d-none');
}

async function eliminar(id) {
  if (!confirm('¿Eliminar este criterio?')) return;
  const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
  if (res.ok) obtenerCriterios();
}

// Escapar caracteres para evitar errores HTML o JS
function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escapeJS(str) {
  return String(str)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\n/g, '')
    .replace(/\r/g, '');
}
