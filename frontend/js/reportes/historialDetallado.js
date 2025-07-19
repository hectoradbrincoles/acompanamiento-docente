//frontend/js/reportes/historialDetallado.js

document.addEventListener('DOMContentLoaded', async () => {
  const tabla = document.getElementById('tablaHistorial');
  const cuerpo = tabla.querySelector('tbody');
  const filtroAnio = document.getElementById('filtroAnio');
  const token = localStorage.getItem('token');

  if (!token) {
    window.location.href = '/pages/login.html';
    return;
  }

  let historial = [];

  const cargarHistorial = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/reportes/historial-docente', {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });

      historial = await res.json();
      if (!Array.isArray(historial)) throw new Error('Respuesta inesperada');
      llenarFiltroAnios(historial);
      renderTabla();
    } catch (err) {
      console.error('❌ Error al cargar historial:', err);
      cuerpo.innerHTML = `<tr><td colspan="8" class="text-danger text-center">Error al cargar los datos.</td></tr>`;
    }
  };

  const llenarFiltroAnios = (data) => {
    const anios = [...new Set(data.map(item => item._id?.año))].filter(Boolean).sort();
    filtroAnio.innerHTML = `<option value="">Todos</option>` +
      anios.map(a => `<option value="${a}">${a}</option>`).join('');
  };

  const renderTabla = () => {
    const anioSeleccionado = filtroAnio.value;
    const filtrado = historial.filter(item => {
      return !anioSeleccionado || item._id.año.toString() === anioSeleccionado;
    });

    cuerpo.innerHTML = '';

    if (filtrado.length === 0) {
      cuerpo.innerHTML = `<tr><td colspan="8" class="text-muted text-center">No hay datos disponibles.</td></tr>`;
      return;
    }

    filtrado.forEach((item, index) => {
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${index + 1}</td>
        <td>${item._id.nombre || '—'}</td>
        <td>${item._id.asignatura || '—'}</td>
        <td>${item._id.especialidad || '—'}</td>
        <td>${item._id.año || '—'}</td>
        <td>${item.cantidadEvaluaciones}</td>
        <td>${item.promedioAnual?.toFixed(2) || '—'}</td>
        <td>${item.modulos?.join(', ') || '—'}</td>
      `;
      cuerpo.appendChild(fila);
    });
  };

  filtroAnio.addEventListener('change', renderTabla);
  await cargarHistorial();

  // 📤 Exportar a PDF
  document.getElementById('btnExportarPDF').addEventListener('click', async () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const logo = new Image();
    logo.src = '/img/ministerio.jpg'; // ✅ Usa la misma ruta funcional

    logo.onload = () => {
      doc.addImage(logo, 'JPEG', 14, 10, 30, 20);
      doc.setFontSize(14);
      doc.text("Historial Detallado del Docente", 50, 20);
      doc.setFontSize(10);
      doc.text(`Generado: ${new Date().toLocaleString()}`, 50, 26);

      const filas = [];
      const rows = cuerpo.querySelectorAll('tr');
      rows.forEach(tr => {
        const celdas = Array.from(tr.querySelectorAll('td')).map(td => td.innerText);
        if (celdas.length > 0) filas.push(celdas);
      });

      doc.autoTable({
        head: [['#', 'Docente', 'Asignatura', 'Especialidad', 'Año', 'Evaluaciones', 'Promedio', 'Módulos']],
        body: filas,
        startY: 35,
        styles: { fontSize: 9, cellPadding: 2 },
        headStyles: { fillColor: [52, 58, 64] }
      });

      doc.save('Historial_Docente.pdf');
    };

    logo.onerror = () => {
      alert('❌ No se pudo cargar el logo. Verifica que /img/ministerio.jpg exista.');
    };
  });

  // 📤 Exportar a Excel (CSV)
  document.getElementById('btnExportar').addEventListener('click', () => {
    const filas = Array.from(cuerpo.querySelectorAll('tr'));
    if (filas.length === 0) return alert('No hay datos para exportar');

    let csv = '#,Docente,Asignatura,Especialidad,Año,Evaluaciones,Promedio,Módulos\n';

    filas.forEach(tr => {
      const celdas = Array.from(tr.querySelectorAll('td')).map(td => `"${td.textContent.trim()}"`);
      csv += celdas.join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Historial_Docente.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
});
