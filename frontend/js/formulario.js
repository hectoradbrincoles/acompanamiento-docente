// 📁 frontend/js/formulario.js

document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const docenteId = params.get('id');
  const token = localStorage.getItem('token');

  if (!token) {
    alert('⚠️ Sesión expirada. Por favor, vuelve a iniciar sesión.');
    window.location.href = '../login.html';
    return;
  }

  if (!docenteId || !isValidObjectId(docenteId)) {
    alert('❌ ID de docente no válido en la URL');
    window.location.href = 'panel.html';
    return;
  }

  try {
    const docente = await loadDocenteData(docenteId, token);
    const coordinador = await loadCoordinadorData(docente, token);

    // CONSOLAS DE DEPURACIÓN
    console.log('🚦 Docente cargado:', docente);
    console.log('🚦 Coordinador cargado:', coordinador);

    setupFormFields(docente, coordinador);
    console.log('✅ Datos cargados correctamente');
  } catch (error) {
    console.error('❌ Error al cargar datos:', error);
    alert(`Error al cargar datos: ${error.message}\nPor favor, recarga la página.`);
  }
});

// Validar si el ID es de tipo ObjectId válido de MongoDB
function isValidObjectId(id) {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

// Obtener datos del docente desde el backend
async function loadDocenteData(id, token) {
  const res = await fetch(`http://localhost:4000/api/usuarios/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`Error al cargar docente: ${res.status} - ${msg}`);
  }

  return await res.json();
}

// Obtener datos del coordinador asignado o el usuario actual si es coordinador
async function loadCoordinadorData(docente, token) {
  let coordinador = { id: '', nombre: '', correo: '' };

  if (docente.coordinadorAsignado) {
    if (typeof docente.coordinadorAsignado === 'object') {
      coordinador = {
        id: docente.coordinadorAsignado._id,
        nombre: docente.coordinadorAsignado.nombre || '',
        correo: docente.coordinadorAsignado.correo || ''
      };
    } else {
      const res = await fetch(`http://localhost:4000/api/usuarios/${docente.coordinadorAsignado}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        coordinador = {
          id: data._id,
          nombre: data.nombre,
          correo: data.correo
        };
      }
    }
  }

  // Si no hay coordinador asignado, usar el usuario actual si es coordinador
  if (!coordinador.id) {
    const perfil = await fetch('http://localhost:4000/api/auth/perfil', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (perfil.ok) {
      const data = await perfil.json();
      if (data.rol === 'Coordinador') {
        coordinador = {
          id: data._id,
          nombre: data.nombre,
          correo: data.correo
        };
      }
    }
  }

  return coordinador;
}

// Cargar los campos del formulario con la información obtenida
function setupFormFields(docente, coordinador) {
  // CONSOLAS DE DEPURACIÓN EN LOS CAMPOS
  console.log('📝 Llenando campos del formulario...');
  // Docente
  setupInputField('docenteNombre', docente.nombre || '', true);
  setupInputField('correoInstitucional', docente.correoInstitucional || docente.correo || '', true);

  // Centro educativo (nombre y código si existen)
  setupInputField('centroEducativo', docente.centroEducativo?.nombre || '', true);
  setupInputField('codigoCentro', docente.centroEducativo?.codigo || '', true);

  // Coordinador
  setupInputField('nombreCoordinador', coordinador.nombre, true);
  setupInputField('correoCoordinador', coordinador.correo, true);

  // IDs ocultos
  setupHiddenField('docenteId', docente._id);
  setupHiddenField('coordinadorId', coordinador.id);

  // Asignar fecha actual si está vacía
  const fechaInput = document.querySelector('input[name="fecha"]');
  if (fechaInput && !fechaInput.value) {
    fechaInput.valueAsDate = new Date();
  }
}

// Rellenar campos visibles (text/email)
function setupInputField(name, value, readOnly = false) {
  const input = document.querySelector(`input[name="${name}"]`);
  if (input) {
    input.value = value;
    input.readOnly = readOnly;
    // Depuración por campo:
    console.log(`🟢 Campo "${name}" rellenado con:`, value);
  } else {
    // Si el campo no existe, lo notifica
    console.warn(`⚠️ No se encontró el input con name="${name}" en el HTML.`);
  }
}

// Rellenar campos ocultos (IDs)
function setupHiddenField(name, value) {
  let input = document.querySelector(`input[name="${name}"]`);
  if (!input) {
    input = document.createElement('input');
    input.type = 'hidden';
    input.name = name;
    document.getElementById('wizardForm').appendChild(input);
  }
  input.value = value;
  console.log(`🟢 Campo oculto "${name}" rellenado con:`, value);
}
