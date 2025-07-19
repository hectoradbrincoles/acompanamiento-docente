// 📁 frontend/js/coordinador/reportes/historialObservacion.js

document.addEventListener('DOMContentLoaded', async () => {
  const tabla = document.getElementById('tablaObservacion');
  const cuerpo = tabla.querySelector('tbody');
  const filtroAnio = document.getElementById('filtroAnio');
  const token = localStorage.getItem('token');

  if (!token) {
    window.location.href = '/pages/login.html';
    return;
  }

  let observaciones = [];

  // 🚀 Cargar observaciones desde la API
  const cargarDatos = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/reportes/observacion-clase', {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });

      observaciones = await res.json();
      if (!Array.isArray(observaciones)) throw new Error('Respuesta inválida');

      llenarFiltros(observaciones);
      renderTabla();
    } catch (err) {
      console.error('❌ Error al cargar observaciones:', err);
      cuerpo.innerHTML = `<tr><td colspan="7" class="text-danger text-center">Error al cargar los datos.</td></tr>`;
    }
  };

  // 🎛️ Llenar filtro de año
  const llenarFiltros = (data) => {
    const anios = new Set();
    data.forEach(ev => {
      if (ev.fecha) anios.add(new Date(ev.fecha).getFullYear());
    });

    filtroAnio.innerHTML = `<option value="">Todos</option>` +
      [...anios].sort().map(a => `<option value="${a}">${a}</option>`).join('');
  };

  // 📋 Renderizar tabla con datos filtrados
  const renderTabla = () => {
    const anio = filtroAnio.value;

    const filtrado = observaciones.filter(ev => {
      const evAnio = new Date(ev.fecha).getFullYear().toString();
      return anio === '' || evAnio === anio;
    });

    cuerpo.innerHTML = '';

    if (filtrado.length === 0) {
      cuerpo.innerHTML = `<tr><td colspan="7" class="text-muted text-center">No hay datos con los filtros aplicados.</td></tr>`;
      return;
    }

    filtrado.forEach((obs, index) => {
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${index + 1}</td>
        <td>${obs.docente || '—'}</td>
        <td>${obs.asignatura || '—'}</td>
        <td>${obs.moduloFormativo || '—'}</td>
        <td>${obs.fecha ? new Date(obs.fecha).toLocaleDateString() : '—'}</td>
        <td>${obs.observador || '—'}</td>
        <td class="text-center">${obs.resultadoFinal?.toFixed(2) || '—'}</td>
      `;
      cuerpo.appendChild(fila);
    });
  };

  filtroAnio.addEventListener('change', renderTabla);
  await cargarDatos();

  // 📤 Exportar a PDF
  document.getElementById('btnExportPDF').addEventListener('click', async () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // 🔽 Logo base64 (reemplaza por el tuyo si quieres usar otro)
  const logo = new Image();
  logo.src = '/img/ministerio.jpg'; // Ruta pública a tu logo

  logo.onload = () => {
    doc.addImage(logo, 'JPEG', 14, 10, 30, 20); // x, y, width, height

    doc.setFontSize(14);
    doc.text("Historial de Observación de Clases", 50, 20); // sin emoji

    doc.setFontSize(10);
    doc.text(`Generado: ${new Date().toLocaleString()}`, 50, 26);

    const filas = [];
    const rows = cuerpo.querySelectorAll('tr');
    rows.forEach(tr => {
      const celdas = Array.from(tr.querySelectorAll('td')).map(td => td.innerText);
      if (celdas.length > 0) filas.push(celdas);
    });

    doc.autoTable({
      head: [['#', 'Docente', 'Asignatura', 'Módulo', 'Fecha', 'Observador', 'Resultado']],
      body: filas,
      startY: 35,
      styles: { fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [52, 58, 64] }
    });

    doc.save('Historial_Observaciones.pdf');
  };
});


  // 📤 Exportar a Excel
  document.getElementById('btnExportExcel').addEventListener('click', () => {
    const wb = XLSX.utils.book_new();
    const datos = [];
    const filas = cuerpo.querySelectorAll('tr');

    filas.forEach(tr => {
      const fila = Array.from(tr.querySelectorAll('td')).map(td => td.innerText);
      if (fila.length > 0) datos.push(fila);
    });

    const ws = XLSX.utils.aoa_to_sheet([['#', 'Docente', 'Asignatura', 'Módulo', 'Fecha', 'Observador', 'Resultado'], ...datos]);
    XLSX.utils.book_append_sheet(wb, ws, 'Observaciones');
    XLSX.writeFile(wb, 'Historial_Observaciones.xlsx');
  });
});
