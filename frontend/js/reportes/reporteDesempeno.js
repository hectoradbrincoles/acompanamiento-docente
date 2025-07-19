// 📁 /frontend/js/reportes/reporteDesempeno.js

const API_URL = 'http://localhost:4000';
const token = localStorage.getItem('token');

if (!token) {
  alert('⚠️ Sesión expirada. Inicia sesión nuevamente.');
  window.location.href = '../../login.html';
}

document.addEventListener('DOMContentLoaded', () => {
  cargarReporte();
});

function cerrarSesion() {
  localStorage.clear();
  window.location.href = '../../login.html';
}

async function cargarReporte() {
  try {
    const res = await fetch(`${API_URL}/api/reportes/desempeno-docente`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!res.ok) throw new Error('No autorizado');

    const datos = await res.json();
    const tbody = document.querySelector('#tablaDesempeno tbody');
    tbody.innerHTML = '';

    if (datos.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" class="text-center">No hay datos disponibles.</td></tr>`;
      return;
    }

    datos.forEach((item, index) => {
      const fila = `
        <tr>
          <td>${index + 1}</td>
          <td>${item.docente}</td>
          <td>${item.modulo}</td>
          <td>${item.año}</td>
          <td>${item.total}</td>
          <td>${item.componentes.planificacion}</td>
          <td>${item.componentes.practica}</td>
          <td>${item.cantidad}</td>
        </tr>
      `;
      tbody.insertAdjacentHTML('beforeend', fila);
    });

  } catch (error) {
    console.error('❌ Error al cargar el reporte:', error);
    alert('No se pudo cargar el reporte de desempeño.');
  }
}

function exportarExcel() {
  const tabla = document.getElementById('tablaDesempeno');
  const wb = XLSX.utils.table_to_book(tabla, { sheet: "Desempeño" });
  XLSX.writeFile(wb, 'reporte_desempeno_docente.xlsx');
}

function exportarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(14);
  doc.text('Reporte de Desempeño por Docente', 14, 18);

  const tabla = document.getElementById('tablaDesempeno');
  const headers = Array.from(tabla.querySelectorAll('thead th')).map(th => th.textContent);
  const rows = Array.from(tabla.querySelectorAll('tbody tr')).map(tr =>
    Array.from(tr.querySelectorAll('td')).map(td => td.textContent)
  );

  doc.autoTable({
    head: [headers],
    body: rows,
    startY: 24,
    styles: { fontSize: 9 }
  });

  doc.save('reporte_desempeno_docente.pdf');
}
