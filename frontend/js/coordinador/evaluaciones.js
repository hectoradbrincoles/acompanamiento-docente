// 📁 js/coordinador/evaluaciones.js

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const tbody = document.querySelector("#tablaEvaluaciones tbody");

  // ⚠️ Validación de sesión
  if (!token) {
    alert("⚠️ Sesión expirada. Por favor inicia sesión nuevamente.");
    window.location.href = "../../login.html";
    return;
  }

  fetch("http://localhost:4000/api/coordinador/evaluaciones", {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  })
    .then(res => {
      if (!res.ok) {
        throw new Error("No autorizado");
      }
      return res.json();
    })
    .then(evaluaciones => {
      tbody.innerHTML = "";
      evaluaciones.forEach((eval, index) => {
        const fila = `
          <tr>
            <td>${index + 1}</td>
            <td>${eval.docente || '---'}</td>
            <td>${new Date(eval.fecha).toLocaleDateString()}</td>
            <td>${eval.estado || 'Pendiente'}</td>
            <td>${eval.resultado || '---'}</td>
          </tr>
        `;
        tbody.insertAdjacentHTML("beforeend", fila);
      });
    })
    .catch(err => {
      console.error("Error al cargar evaluaciones:", err);
      tbody.innerHTML = `<tr><td colspan="5">Error al obtener datos.</td></tr>`;
    });
});
