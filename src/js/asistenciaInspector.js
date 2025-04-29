let estudiantesData = {};

document.addEventListener('DOMContentLoaded', () => {
  cargarCursosInspector();
  cargarMeses();
});

async function cargarCursosInspector() {
  const cursoSelect = document.getElementById('cursoSelect');

  try {
    const response = await fetch('src/data/estudiantes.json');
    estudiantesData = await response.json();

    Object.keys(estudiantesData).forEach(curso => {
      const option = document.createElement('option');
      option.value = curso;
      option.textContent = curso;
      cursoSelect.appendChild(option);
    });

    cursoSelect.addEventListener('change', generarTablaAsistenciaInspector);
  } catch (error) {
    console.error('Error cargando estudiantes:', error);
  }
}

function cargarMeses() {
  const mesSelect = document.getElementById('mesSelect');
  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  meses.forEach((mes, index) => {
    const option = document.createElement('option');
    option.value = index + 1;
    option.textContent = mes;
    mesSelect.appendChild(option);
  });

  mesSelect.addEventListener('change', generarTablaAsistenciaInspector);
}

function generarTablaAsistenciaInspector() {
  const cursoSeleccionado = document.getElementById('cursoSelect').value;
  const mesSeleccionado = document.getElementById('mesSelect').value;
  const container = document.getElementById('tablaAsistenciaContainer');
  container.innerHTML = '';

  if (!cursoSeleccionado || !mesSeleccionado) return;

  const estudiantes = estudiantesData[cursoSeleccionado];
  if (!estudiantes) {
    container.innerHTML = '<p>No hay estudiantes para este curso.</p>';
    return;
  }

  const year = new Date().getFullYear();
  const daysInMonth = new Date(year, mesSeleccionado, 0).getDate();
  const diasHabiles = [];

  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, mesSeleccionado - 1, i);
    const day = date.getDay();
    if (day !== 0 && day !== 6) {
      diasHabiles.push(i);
    }
  }

  let table = '<table class="table table-bordered">';
  table += '<thead><tr><th>Estudiante</th>';

  diasHabiles.forEach(dia => {
    table += `<th>${dia}</th>`;
  });

  table += '</tr></thead><tbody>';

  estudiantes.forEach((estudiante, i) => {
    table += `<tr><td>${estudiante}</td>`;
    diasHabiles.forEach((dia, j) => {
      const id = `asis-${i}-${j}`;
      table += `<td contenteditable="true" id="${id}" oninput="colorearAsistencia('${id}')"></td>`;
    });
    table += '</tr>';
  });

  table += '</tbody></table>';

  container.innerHTML = table;
}

function colorearAsistencia(id) {
  const celda = document.getElementById(id);
  const valor = celda.innerText.trim().toUpperCase();

  if (valor === "✓") {
    celda.style.backgroundColor = "lightgreen";
  } else if (valor === "✗") {
    celda.style.backgroundColor = "lightcoral";
  } else if (valor === "J") {
    celda.style.backgroundColor = "lightskyblue";
  } else {
    celda.style.backgroundColor = "";
  }
}

function guardarAsistencia() {
  alert('✅ Asistencia del inspector guardada exitosamente.');
}

function exportarAsistencia() {
  const cursoSeleccionado = document.getElementById('cursoSelect').value;
  const mesSeleccionado = document.getElementById('mesSelect').value;

  if (!cursoSeleccionado || !mesSeleccionado) {
    alert('Seleccione un curso y un mes primero.');
    return;
  }

  const year = new Date().getFullYear();
  const estudiantes = estudiantesData[cursoSeleccionado];
  const asistenciaExport = {};

  estudiantes.forEach((estudiante, i) => {
    asistenciaExport[estudiante] = {};

    const daysInMonth = new Date(year, mesSeleccionado, 0).getDate();
    const diasHabiles = [];

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, mesSeleccionado - 1, d);
      const day = date.getDay();
      if (day !== 0 && day !== 6) {
        diasHabiles.push(d);
      }
    }

    diasHabiles.forEach((dia, j) => {
      const id = `asis-${i}-${j}`;
      const asistencia = document.getElementById(id).innerText.trim();
      asistenciaExport[estudiante][dia] = asistencia;
    });
  });

  const blob = new Blob([JSON.stringify(asistenciaExport, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `asistencia_inspector_${cursoSeleccionado}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function cerrarSesion() {
  sessionStorage.removeItem('usuario');
  window.location.href = 'index.html';
}
