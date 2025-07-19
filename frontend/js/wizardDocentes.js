// 📁 frontend/js/wizardDocentes.js

document.addEventListener('DOMContentLoaded', async () => {
  const inputNombre = document.querySelector('input[name="docente"]');
  const inputAsignatura = document.querySelector('input[name="asignatura"]');
  const inputEspecialidad = document.querySelector('input[name="especialidad"]');

  const params = new URLSearchParams(window.location.search);
  const docenteId = params.get("id");

  if (!docenteId) {
    console.warn("❌ No se proporcionó un ID de docente en la URL.");
    return;
  }

  try {
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:4000/api/docente/${docenteId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error("Docente no encontrado");

    const docente = await res.json();

    // Autocompletar los campos si existen
    if (inputNombre) inputNombre.value = docente.nombre || '';
    if (inputAsignatura) inputAsignatura.value = docente.asignatura || '';
    if (inputEspecialidad) inputEspecialidad.value = docente.area || docente.especialidad || '';

  } catch (err) {
    console.error("❌ Error al cargar los datos del docente:", err);
    alert("No se pudieron cargar los datos del docente. Verifica si el ID es válido.");
  }
});
