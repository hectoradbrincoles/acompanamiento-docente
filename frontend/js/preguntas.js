// 📁 frontend/js/preguntas.js

const API_PREGUNTAS = 'http://localhost:4000/api/preguntas';

let preguntaModoEdicion = false;
let preguntaIdActual = null;
let criterioActualId = null;

/**
 * Mostrar el modal para agregar una nueva pregunta
 */
function agregarPregunta(criterioId) {
  preguntaModoEdicion = false;
  criterioActualId = criterioId;
  preguntaIdActual = null;

  document.getElementById('formPregunta').reset();
  document.getElementById('modalTituloPregunta').textContent = '📝 Nueva Pregunta';

  new bootstrap.Modal(document.getElementById('modalPregunta')).show();
}

/**
 * Mostrar el modal para editar una pregunta existente
 */
function editarPregunta(id, texto, evaluable, tipo_respuesta, valor) {
  preguntaModoEdicion = true;
  preguntaIdActual = id;

  document.getElementById('textoPregunta').value = texto;
  document.getElementById('llevaCalificacion').checked = evaluable;
  document.getElementById('tipoPregunta').value = tipo_respuesta;
  document.getElementById('valorPregunta').value = valor || 0;

  document.getElementById('modalTituloPregunta').textContent = '✏️ Editar Pregunta';
  new bootstrap.Modal(document.getElementById('modalPregunta')).show();
}

/**
 * Guardar o actualizar pregunta al enviar el formulario
 */
document.getElementById('formPregunta').addEventListener('submit', async function (e) {
  e.preventDefault();

  const texto = document.getElementById('textoPregunta').value.trim();
  const tipo_respuesta = document.getElementById('tipoPregunta').value;
  const evaluable = document.getElementById('llevaCalificacion').checked;
  const valor = parseFloat(document.getElementById('valorPregunta').value);

  if (!texto || !tipo_respuesta || isNaN(valor)) {
    return alert('⚠️ Todos los campos son obligatorios y el valor debe ser numérico.');
  }

  const payload = {
    texto,
    tipo_respuesta,
    evaluable,
    valor
  };

  try {
    const res = await fetch(
      preguntaModoEdicion
        ? `${API_PREGUNTAS}/${preguntaIdActual}`
        : API_PREGUNTAS,
      {
        method: preguntaModoEdicion ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          preguntaModoEdicion ? payload : { ...payload, criterio: criterioActualId }
        )
      }
    );

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || '❌ Error al guardar la pregunta.');
    }

    bootstrap.Modal.getInstance(document.getElementById('modalPregunta')).hide();
    document.getElementById('formPregunta').reset();

    if (typeof obtenerCriterios === 'function') obtenerCriterios();
  } catch (err) {
    alert(err.message);
  }
});

/**
 * Eliminar (desactivar) una pregunta
 */
function eliminarPregunta(id) {
  if (!confirm('¿Eliminar esta pregunta?')) return;

  fetch(`${API_PREGUNTAS}/${id}`, {
    method: 'DELETE'
  })
    .then(res => {
      if (!res.ok) throw new Error('❌ No se pudo eliminar.');
      return res.json();
    })
    .then(() => {
      if (typeof obtenerCriterios === 'function') obtenerCriterios();
    })
    .catch(err => alert(err.message));
}
