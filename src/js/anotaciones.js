let estudiantesDataAnotaciones = {};
let anotacionesGuardadas = [];

document.addEventListener('DOMContentLoaded', () => {
  cargarCursosAnotaciones();
  precargarFechaHoy();
});

async function cargarCursosAnotaciones() {
  const cursoSelect = document.getElementById('cursoSelect');

  try {
    const response = await fetch('src/data/estudiantes.json');
    estudiantesDataAnotaciones = await response.json();

    Object.keys(estudiantesDataAnotaciones).forEach(curso => {
      const option = document.createElement('option');
      option.value = curso;
      option.textContent = curso;
      cursoSelect.appendChild(option);
    });

    cursoSelect.addEventListener('change', cargarEstudiantes);
  } catch (error) {
    console.error('Error cargando estudiantes:', error);
  }
}

function cargarEstudiantes() {
  const cursoSeleccionado = document.getElementById('cursoSelect').value;
  const estudianteSelect = document.getElementById('estudianteSelect');
  estudianteSelect.innerHTML = '<option value="">Seleccione un estudiante</option>';

  if (!cursoSeleccionado) return;

  const estudiantes = estudiantesDataAnotaciones[cursoSeleccionado];
  if (!estudiantes) return;

  estudiantes.forEach(estudiante => {
    const option = document.createElement('option');
    option.value = estudiante;
    option.textContent = estudiante;
    estudianteSelect.appendChild(option);
  });
}

function precargarFechaHoy() {
  const fechaInput = document.getElementById('fechaAnotacion');
  const hoy = new Date();
  const fechaHoy = hoy.toISOString().split('T')[0];
  fechaInput.value = fechaHoy;
}

function guardarAnotacion() {
  const curso = document.getElementById('cursoSelect').value;
  const estudiante = document.getElementById('estudianteSelect').value;
  const fecha = document.getElementById('fechaAnotacion').value;
  const tipo = document.getElementById('tipoSelect').value;
  const detalle = document.getElementById('detalleAnotacion').value.trim();

  if (!curso || !estudiante || !fecha || !tipo || !detalle) {
    alert('Por favor complete todos los campos antes de guardar.');
    return;
  }

  const nuevaAnotacion = { curso, estudiante, fecha, tipo, detalle };
  anotacionesGuardadas.push(nuevaAnotacion);

  mostrarAnotaciones();
  limpiarFormulario();
  alert('✅ Anotación guardada exitosamente.');
}

function mostrarAnotaciones() {
  const container = document.getElementById('tablaAnotacionesContainer');
  container.innerHTML = '';

  if (anotacionesGuardadas.length === 0) {
    container.innerHTML = '<p>No hay anotaciones registradas aún.</p>';
    return;
  }

  let table = '<table class="table table-striped">';
  table += '<thead><tr><th>Curso</th><th>Estudiante</th><th>Fecha</th><th>Tipo</th><th>Detalle</th></tr></thead><tbody>';

  anotacionesGuardadas.forEach(anotacion => {
    table += `<tr>
      <td>${anotacion.curso}</td>
      <td>${anotacion.estudiante}</td>
      <td>${anotacion.fecha}</td>
      <td>${anotacion.tipo}</td>
      <td>${anotacion.detalle}</td>
    </tr>`;
  });

  table += '</tbody></table>';

  container.innerHTML = table;
}

function limpiarFormulario() {
  document.getElementById('detalleAnotacion').value = '';
  document.getElementById('tipoSelect').value = '';
}

function exportarAnotaciones() {
  if (anotacionesGuardadas.length === 0) {
    alert('No hay anotaciones para exportar.');
    return;
  }

  const blob = new Blob([JSON.stringify(anotacionesGuardadas, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'anotaciones_inlib.json';
  a.click();
  URL.revokeObjectURL(url);
}

function cerrarSesion() {
  sessionStorage.removeItem('usuario');
  window.location.href = 'index.html';
}
