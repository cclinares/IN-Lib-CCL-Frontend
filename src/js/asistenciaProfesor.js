let estudiantesDataProfesor = {};
let asignaturasDataProfesor = {};

document.addEventListener('DOMContentLoaded', () => {
  precargarFechaHoy();
  cargarCursosProfesor();
});

function precargarFechaHoy() {
  const fechaInput = document.getElementById('fechaClase');
  const hoy = new Date();
  const fechaHoy = hoy.toISOString().split('T')[0];
  fechaInput.value = fechaHoy;
}

async function cargarCursosProfesor() {
  const cursoSelect = document.getElementById('cursoSelect');

  try {
    const response = await fetch('src/data/estudiantes.json');
    estudiantesDataProfesor = await response.json();

    const responseAsignaturas = await fetch('src/data/asignaturas.json');
    asignaturasDataProfesor = await responseAsignaturas.json();

    Object.keys(estudiantesDataProfesor).forEach(curso => {
      const option = document.createElement('option');
      option.value = curso;
      option.textContent = curso;
      cursoSelect.appendChild(option);
    });

    cursoSelect.addEventListener('change', cargarAsignaturasProfesor);
  } catch (error) {
    console.error('Error cargando estudiantes/asignaturas:', error);
  }
}

function cargarAsignaturasProfesor() {
  const cursoSeleccionado = document.getElementById('cursoSelect').value;
  const asignaturaSelect = document.getElementById('asignaturaSelect');
  asignaturaSelect.innerHTML = '<option value="">Seleccione una asignatura</option>';

  if (!cursoSeleccionado) return;

  const asignaturas = asignaturasDataProfesor[cursoSeleccionado];
  if (!asignaturas) return;

  asignaturas.forEach(asignatura => {
    const option = document.createElement('option');
    option.value = asignatura;
    option.textContent = asignatura;
    asignaturaSelect.appendChild(option);
  });

  asignaturaSelect.addEventListener('change', generarTablaAsistenciaProfesor);
}

function generarTablaAsistenciaProfesor() {
  const cursoSeleccionado = document.getElementById('cursoSelect').value;
  const container = document.getElementById('tablaAsistenciaProfesorContainer');
  container.innerHTML = '';

  if (!cursoSeleccionado) return;

  const estudiantes = estudiantesDataProfesor[cursoSeleccionado];
  if (!estudiantes) {
    container.innerHTML = '<p>No hay estudiantes para este curso.</p>';
    return;
  }

  let table = '<table class="table table-bordered">';
  table += '<thead><tr><th>Estudiante</th><th>Asistencia</th></tr></thead><tbody>';

  estudiantes.forEach((estudiante, i) => {
    table += `<tr><td>${estudiante}</td>`;
    table += `<td contenteditable="true" id="asis-profe-${i}" oninput="colorearAsistenciaProfesor('${i}')"></td>`;
    table += '</tr>';
  });

  table += '</tbody></table>';

  container.innerHTML = table;
}

function colorearAsistenciaProfesor(i) {
  const celda = document.getElementById(`asis-profe-${i}`);
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

function guardarAsistenciaProfesor() {
  alert('✅ Asistencia de la clase guardada exitosamente.');
}

function exportarAsistenciaProfesor() {
  const cursoSeleccionado = document.getElementById('cursoSelect').value;
  const asignaturaSeleccionada = document.getElementById('asignaturaSelect').value;
  const fechaSeleccionada = document.getElementById('fechaClase').value;

  if (!cursoSeleccionado || !asignaturaSeleccionada || !fechaSeleccionada) {
    alert('Debe seleccionar curso, asignatura y fecha.');
    return;
  }

  const estudiantes = estudiantesDataProfesor[cursoSeleccionado];
  const asistenciaExport = {};

  estudiantes.forEach((estudiante, i) => {
    const asistencia = document.getElementById(`asis-profe-${i}`).innerText.trim();
    asistenciaExport[estudiante] = asistencia;
  });

  const resultado = {
    fecha: fechaSeleccionada,
    curso: cursoSeleccionado,
    asignatura: asignaturaSeleccionada,
    asistencia: asistenciaExport
  };

  const blob = new Blob([JSON.stringify(resultado, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `asistencia_profesor_${cursoSeleccionado}_${asignaturaSeleccionada}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function cerrarSesion() {
  sessionStorage.removeItem('usuario');
  window.location.href = 'index.html';
}
