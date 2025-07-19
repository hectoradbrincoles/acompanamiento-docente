document.addEventListener('DOMContentLoaded', async () => {
  const tabla = document.getElementById('tablaComparativa');
  const cuerpo = tabla.querySelector('tbody');
  const token = localStorage.getItem('token');

  if (!token) {
    window.location.href = '/pages/login.html';
    return;
  }

  let datos = [];

  // 📋 Renderizar la tabla
  const renderTabla = () => {
    cuerpo.innerHTML = '';

    datos.forEach((item, index) => {
      const area = item._id || 'Sin asignatura';
      const promedio = item.promedioArea?.toFixed(2) || '0.00';

      item.docentes.forEach((docente, i) => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
          <td>${index + 1}.${i + 1}</td>
          <td>${area}</td>
          <td>${docente.nombre}</td>
          <td>${docente.resultado?.toFixed(2)}</td>
          <td>${promedio}</td>
        `;
        cuerpo.appendChild(fila);
      });
    });
  };

  // 🚀 Cargar datos del backend
  try {
    const res = await fetch('http://localhost:4000/api/reportes/comparativo-area', {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });

    datos = await res.json();
    if (!Array.isArray(datos)) throw new Error('Respuesta inesperada');

    renderTabla();
  } catch (err) {
    console.error('❌ Error al cargar el reporte comparativo:', err);
    cuerpo.innerHTML = `<tr><td colspan="5" class="text-danger">No se pudo cargar el reporte.</td></tr>`;
  }

  // 📤 Exportar a PDF
  document.getElementById('btnExportPDF').addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const logo = new Image();
    logo.src = '/img/ministerio.jpg';  // Asegúrate que esta ruta sea válida en producción

    logo.onload = () => {
      doc.addImage(logo, 'JPEG', 14, 10, 30, 20);
      doc.setFontSize(14);
      doc.text("Reporte Comparativo por Asignatura", 50, 20);
      doc.setFontSize(10);
      doc.text(`Generado: ${new Date().toLocaleString()}`, 50, 26);

      const filas = [];
      const rows = cuerpo.querySelectorAll('tr');
      rows.forEach(tr => {
        const celdas = Array.from(tr.querySelectorAll('td')).map(td => td.innerText);
        if (celdas.length > 0) filas.push(celdas);
      });

      doc.autoTable({
        head: [['#', 'Área/Asignatura', 'Docente', 'Resultado', 'Promedio Área']],
        body: filas,
        startY: 35,
        styles: { fontSize: 9, cellPadding: 2 },
        headStyles: { fillColor: [52, 58, 64] }
      });

      doc.save('Reporte_Comparativo.pdf');
    };
  });

  // 📤 Exportar a Excel
  document.getElementById('btnExportExcel').addEventListener('click', () => {
    const wb = XLSX.utils.book_new();
    const filas = [];

    const rows = cuerpo.querySelectorAll('tr');
    rows.forEach(tr => {
      const fila = Array.from(tr.querySelectorAll('td')).map(td => td.innerText);
      if (fila.length > 0) filas.push(fila);
    });

    const ws = XLSX.utils.aoa_to_sheet([
      ['#', 'Área/Asignatura', 'Docente', 'Resultado', 'Promedio Área'],
      ...filas
    ]);

    XLSX.utils.book_append_sheet(wb, ws, 'Comparativo');
    XLSX.writeFile(wb, 'Reporte_Comparativo.xlsx');
  });
});
