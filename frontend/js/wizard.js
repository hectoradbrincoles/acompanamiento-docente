// 📁 frontend/js/wizard.js
let currentStep = 0;
let dynamicSteps = [];
const API_URL = 'http://localhost:4000';

const progressBar = document.getElementById('wizardProgressBar');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

// Mostrar paso actual
function showStep(n) {
  dynamicSteps.forEach((step, idx) => {
    step.classList.toggle('active', idx === n);
    step.style.display = idx === n ? 'block' : 'none';
  });

  if (prevBtn) prevBtn.style.display = n === 0 ? 'none' : 'inline-block';
  if (nextBtn) nextBtn.textContent = n === dynamicSteps.length - 1 ? 'Guardar Evaluación' : 'Siguiente';
  if (progressBar) progressBar.style.width = `${((n + 1) / dynamicSteps.length) * 100}%`;
}

// Validar campos requeridos
function validateCurrentStep() {
  const currentStepEl = dynamicSteps[currentStep];

  if (!currentStepEl) {
    console.warn('⚠️ No se encontró el paso actual:', currentStep);
    return false;
  }

  const requiredInputs = currentStepEl.querySelectorAll('[required]');
  let isValid = true;

  requiredInputs.forEach(input => {
    if (!input.value.trim()) {
      input.classList.add('is-invalid');
      isValid = false;
    } else {
      input.classList.remove('is-invalid');
    }
  });

  return isValid;
}

// Validar formato de ObjectId
function isValidObjectId(id) {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

// Recolectar datos del formulario (completo y correcto)
function getWizardData() {
  const form = document.getElementById('wizardForm');
  const formData = new FormData(form);
  const data = {};

  // IDs y campos básicos
  data.docente = document.querySelector('#docenteId')?.value || formData.get('docente');
  data.coordinador = document.querySelector('#coordinadorId')?.value || formData.get('coordinador');
  if (!isValidObjectId(data.docente)) throw new Error('ID de docente no válido');
  if (!isValidObjectId(data.coordinador)) throw new Error('ID de coordinador no válido');

  // 1. Campos generales (excepto planificación)
  form.querySelectorAll('input, textarea').forEach(el => {
    if (
      el.name &&
      el.type !== 'checkbox' &&
      !el.name.startsWith('planificacion.')
    ) {
      data[el.name] = el.value;
    } else if (el.type === 'checkbox') {
      if (!data[el.name]) data[el.name] = [];
      if (el.checked) data[el.name].push(el.value);
    }
  });

  // 2. Planificación: desde step-2
  const planificacionFields = [
    'planificacion.contenidos',
    'planificacion.instrumentos',
    'planificacion.fechasActividades',
    'planificacion.actividades',
    'planificacion.bloomElementos',
    'planificacion.bloomNivel',
    'planificacion.encabezado',
    'planificacion.ordenanza'
  ];
  data.planificacion = {};
  planificacionFields.forEach(field => {
    data.planificacion[field.split('.')[1]] = formData.get(field) || '';
  });

  // 3. Preguntas dinámicas
  dynamicSteps.forEach(step => {
    const selects = step.querySelectorAll('select');
    selects.forEach(select => {
      if (select.name && select.value) {
        data[select.name] = select.value;
      }
    });
  });

  // 4. Eliminar campos "planificacion.xxxx" planos del objeto raíz
  Object.keys(data).forEach(key => {
    if (key.startsWith('planificacion.')) delete data[key];
  });

  return data;
}

// Función de navegación (Siguiente / Anterior / Guardar)
async function nextPrev(n) {
  if (n === 1 && !validateCurrentStep()) {
    alert('Por favor complete todos los campos requeridos');
    return;
  }

  if (n === 1 && currentStep === dynamicSteps.length - 1) {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No hay token de autenticación');

      const datos = getWizardData();
      // console.log('🟢 DATOS ENVIADOS:', datos);

      const response = await fetch(`${API_URL}/api/evaluaciones`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(datos)
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.error || `Error ${response.status}: ${response.statusText}`);

      alert('✅ Evaluación registrada correctamente');
      window.location.href = 'panel.html';
    } catch (error) {
      console.error('❌ Error al guardar evaluación:', error);
      alert(`❌ ${error.message}`);
    }
    return;
  }

  currentStep += n;
  currentStep = Math.max(0, Math.min(currentStep, dynamicSteps.length - 1));
  showStep(currentStep);
}

// Renderizar criterios desde la API
async function cargarCriteriosYRenderizar() {
  try {
    const res = await fetch(`${API_URL}/api/criterios`);
    const criterios = await res.json();
    const placeholder = document.getElementById('pasosDinamicos');

    criterios.forEach((criterio, index) => {
      const paso = document.createElement('div');
      paso.className = 'step';
      paso.id = `paso-${index + 3}`; // Ahora inicia en 3 porque tienes 3 pasos fijos

      const totalPuntos = criterio.ponderacion || 0;
      const preguntas = criterio.preguntas || [];

      paso.innerHTML = `
        <h4>${criterio.titulo}</h4>
        <p class="text-muted mb-1">${criterio.descripcion || ''}</p>
        <p class="text-success fw-bold">Valor total: ${totalPuntos} puntos</p>
      `;

      preguntas.forEach(pregunta => {
        paso.innerHTML += `
          <div class="mb-3">
            <label>${pregunta.texto} <span class="text-info">(${pregunta.valor} pts)</span></label>
            <select class="form-select" name="pregunta_${pregunta._id}" required>
              <option value="">Seleccione</option>
              <option value="Sí">Sí</option>
              <option value="Sí, pero puede mejorar">Sí, pero puede mejorar</option>
              <option value="No">No</option>
            </select>
          </div>
        `;
      });

      placeholder.appendChild(paso);
      dynamicSteps.push(paso);
    });

    // Incluir los pasos fijos del formulario
    const step0 = document.getElementById('step-0');
    const step1 = document.getElementById('step-1');
    const step2 = document.getElementById('step-2');
    dynamicSteps.unshift(step0, step1, step2);

    showStep(currentStep);
  } catch (error) {
    console.error('❌ Error al cargar criterios:', error);
    alert('No se pudieron cargar los criterios de evaluación');
  }
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  cargarCriteriosYRenderizar();
});

function setupEventListeners() {
  if (prevBtn) prevBtn.addEventListener('click', () => nextPrev(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => nextPrev(1));

  document.getElementById('wizardForm')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && document.activeElement.tagName !== 'TEXTAREA') {
      e.preventDefault();
      nextPrev(1);
    }
  });
}


