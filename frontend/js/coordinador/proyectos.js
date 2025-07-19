// 📁 js/coordinador/proyectos.js

document.addEventListener("DOMContentLoaded", () => {
  const tbody = document.querySelector("#listaProyectos tbody");

  fetch("http://localhost:4000/api/coordinador/proyectos")
    .then(res => res.json())
    .then(proyectos => {
      tbody.innerHTML = "";
      proyectos.forEach((proy, index) => {
        const fila = `
          <tr>
            <td>${index + 1}</td>
            <td>${proy.titulo}</td>
            <td>${proy.docente?.nombre || '---'}</td>
            <td>${proy.estado}</td>
          </tr>
        `;
        tbody.insertAdjacentHTML("beforeend", fila);
      });
    })
    .catch(err => {
      console.error("Error al cargar proyectos:", err);
      tbody.innerHTML = `<tr><td colspan="4">Error al obtener datos.</td></tr>`;
    });
});