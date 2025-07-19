// 📁 frontend/js/coordinador/reportes/historialDocente.js

document.addEventListener('DOMContentLoaded', async () => {
  const tabla = document.getElementById('tablaHistorial');
  const cuerpo = tabla.querySelector('tbody');
  const filtroAnio = document.getElementById('filtroAnio');
  const filtroAsignatura = document.getElementById('filtroAsignatura');
  const token = localStorage.getItem('token');

  if (!token) {
    window.location.href = '/pages/login.html';
    return;
  }

  let evaluaciones = [];

  // 🚀 Cargar historial desde la API
  const cargarDatos = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/reportes/historial-docente', {
        headers: { 'Authorization': 'Bearer ' + token }
      });

      evaluaciones = await res.json();
      if (!Array.isArray(evaluaciones)) throw new Error('Respuesta inesperada');

      llenarFiltros(evaluaciones);
      renderTabla();
    } catch (err) {
      console.error('❌ Error al cargar historial:', err);
      cuerpo.innerHTML = `<tr><td colspan="7" class="text-danger text-center">Error al cargar los datos.</td></tr>`;
    }
  };

  // 🎛️ Llenar filtros dinámicamente
  const llenarFiltros = (data) => {
    const anios = new Set();
    const asignaturas = new Set();

    data.forEach(ev => {
      if (ev.fecha) anios.add(new Date(ev.fecha).getFullYear());
      if (ev.asignatura) asignaturas.add(ev.asignatura);
    });

    filtroAnio.innerHTML = `<option value="">Todos</option>` +
      [...anios].sort().map(a => `<option value="${a}">${a}</option>`).join('');

    filtroAsignatura.innerHTML = `<option value="">Todas</option>` +
      [...asignaturas].sort().map(a => `<option value="${a}">${a}</option>`).join('');
  };

  // 📋 Renderizar tabla con datos filtrados
  const renderTabla = () => {
    const anio = filtroAnio.value;
    const asignatura = filtroAsignatura.value;

    const filtrado = evaluaciones.filter(ev => {
      const evAnio = new Date(ev.fecha).getFullYear().toString();
      const evAsignatura = ev.asignatura || '';
      return (anio === '' || evAnio === anio) && (asignatura === '' || evAsignatura === asignatura);
    });

    cuerpo.innerHTML = '';

    if (filtrado.length === 0) {
      cuerpo.innerHTML = `<tr><td colspan="7" class="text-center text-muted">No hay datos con los filtros aplicados.</td></tr>`;
      return;
    }

    filtrado.forEach((ev, index) => {
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${index + 1}</td>
        <td>${ev.docente || '—'}</td>
        <td>${ev.centroEducativo || '—'}</td>
        <td>${ev.asignatura || '—'}</td>
        <td>${ev.moduloFormativo || '—'}</td>
        <td>${ev.fecha ? new Date(ev.fecha).toLocaleDateString() : '—'}</td>
        <td class="text-center">${ev.resultadoFinal?.toFixed(2) || '—'}</td>
      `;
      cuerpo.appendChild(fila);
    });
  };

  filtroAnio.addEventListener('change', renderTabla);
  filtroAsignatura.addEventListener('change', renderTabla);
  await cargarDatos();

  // 📤 Exportar a PDF
  document.getElementById('btnPDF').addEventListener('click', async () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const logo = new Image();
    logo.src = '/img/ministerio.jpg';

    logo.onload = () => {
      doc.addImage(logo, 'JPEG', 14, 10, 30, 20);
      doc.setFontSize(14);
      doc.text("Historial de Evaluaciones del Docente", 50, 20);
      doc.setFontSize(10);
      doc.text(`Generado: ${new Date().toLocaleString()}`, 50, 26);

      const filas = [];
      const rows = cuerpo.querySelectorAll('tr');
      rows.forEach(tr => {
        const celdas = Array.from(tr.querySelectorAll('td')).map(td => td.innerText);
        if (celdas.length > 0) filas.push(celdas);
      });

      doc.autoTable({
        head: [['#', 'Docente', 'Centro', 'Asignatura', 'Módulo', 'Fecha', 'Resultado']],
        body: filas,
        startY: 35,
        styles: { fontSize: 9, cellPadding: 2 },
        headStyles: { fillColor: [52, 58, 64] }
      });

      doc.save('Historial_Evaluaciones.pdf');
    };
  });

  // 📤 Exportar a Excel
  document.getElementById('btnExcel').addEventListener('click', () => {
    const wb = XLSX.utils.book_new();
    const datos = [];
    const filas = cuerpo.querySelectorAll('tr');

    filas.forEach(tr => {
      const fila = Array.from(tr.querySelectorAll('td')).map(td => td.innerText);
      if (fila.length > 0) datos.push(fila);
    });

    const ws = XLSX.utils.aoa_to_sheet([
      ['#', 'Docente', 'Centro', 'Asignatura', 'Módulo', 'Fecha', 'Resultado'],
      ...datos
    ]);
    XLSX.utils.book_append_sheet(wb, ws, 'Evaluaciones');
    XLSX.writeFile(wb, 'Historial_Evaluaciones.xlsx');
  });
});
