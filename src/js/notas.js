let estudiantesData = {};
let asignaturasData = {};
let notasGuardadas = {};

document.addEventListener('DOMContentLoaded', () => {
  cargarCursos();
});

async function cargarCursos() {
  const cursoSelect = document.getElementById('cursoSelect');

  try {
    const estudiantesResponse = await fetch('src/data/estudiantes.json');
    estudiantesData = await estudiantesResponse.json();

    const asignaturasResponse = await fetch('src/data/asignaturas.json');
    asignaturasData = await asignaturasResponse.json();

    Object.keys(estudiantesData).forEach(curso => {
      const option = document.createElement('option');
      option.value = curso;
      option.textContent = curso;
      cursoSelect.appendChild(option);
    });

    cursoSelect.addEventListener('change', generarTablaNotas);
  } catch (error) {
    console.error('Error cargando datos:', error);
  }
}

function generarTablaNotas() {
  const cursoSeleccionado = document.getElementById('cursoSelect').value;
  const container = document.getElementById('tablaNotasContainer');
  container.innerHTML = '';

  if (!cursoSeleccionado) return;

  const estudiantes = estudiantesData[cursoSeleccionado];
  const asignaturas = asignaturasData[cursoSeleccionado];

  if (!estudiantes || !asignaturas) {
    container.innerHTML = '<p>No hay datos disponibles para este curso.</p>';
    return;
  }

  let table = '<table class="table table-bordered">';
  table += '<thead><tr><th>Estudiante</th>';

  asignaturas.forEach(asignatura => {
    table += `<th>${asignatura}</th>`;
  });

  table += '</tr></thead><tbody>';

  estudiantes.forEach((estudiante, i) => {
    table += `<tr><td>${estudiante}</td>`;
    asignaturas.forEach((asignatura, j) => {
      const id = `nota-${i}-${j}`;
      table += `<td contenteditable="true" id="${id}" oninput="colorearNota('${id}')"></td>`;
    });
    table += '</tr>';
  });

  table += '</tbody></table>';

  container.innerHTML = table;
}

function colorearNota(id) {
  const celda = document.getElementById(id);
  const valor = parseFloat(celda.innerText.trim());

  if (isNaN(valor)) {
    celda.style.backgroundColor = '';
    return;
  }

  if (valor >= 6.0) {
    celda.style.backgroundColor = 'lightgreen';
  } else if (valor >= 4.0 && valor < 6.0) {
    celda.style.backgroundColor = 'khaki';
  } else {
    celda.style.backgroundColor = 'lightcoral';
  }
}

function guardarNotas() {
  const cursoSeleccionado = document.getElementById('cursoSelect').value;
  if (!cursoSeleccionado) {
    alert('Debe seleccionar un curso.');
    return;
  }

  const estudiantes = estudiantesData[cursoSeleccionado];
  const asignaturas = asignaturasData[cursoSeleccionado];

  notasGuardadas[cursoSeleccionado] = {};

  estudiantes.forEach((estudiante, i) => {
    notasGuardadas[cursoSeleccionado][estudiante] = {};

    asignaturas.forEach((asignatura, j) => {
      const id = `nota-${i}-${j}`;
      const nota = document.getElementById(id).innerText.trim();
      notasGuardadas[cursoSeleccionado][estudiante][asignatura] = nota;
    });
  });

  // Guarda en localStorage temporalmente
  localStorage.setItem('notasGuardadas', JSON.stringify(notasGuardadas));

  alert('✅ Notas guardadas exitosamente.');
}

function exportarNotas() {
  const data = JSON.parse(localStorage.getItem('notasGuardadas'));
  if (!data) {
    alert('No hay notas guardadas para exportar.');
    return;
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'notas_inlib.json';
  a.click();
  URL.revokeObjectURL(url);
}

function cerrarSesion() {
  sessionStorage.removeItem('usuario');
  window.location.href = 'index.html';
}
