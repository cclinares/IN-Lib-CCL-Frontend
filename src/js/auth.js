document.getElementById('loginForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const mensajeError = document.getElementById('mensajeError');

  try {
    const response = await fetch('src/data/usuarios.json');
    const usuarios = await response.json();

    const usuarioEncontrado = usuarios.find(user => user.email === email && user.password === password);

    if (usuarioEncontrado) {
      // Guardar sesión simple
      sessionStorage.setItem('usuario', JSON.stringify(usuarioEncontrado));

      // Redirigir según rol
      if (usuarioEncontrado.rol === 'admin') {
        window.location.href = 'dashboard_admin.html';
      } else if (usuarioEncontrado.rol === 'profesor') {
        window.location.href = 'dashboard_profesor.html';
      } else if (usuarioEncontrado.rol === 'inspector') {
        window.location.href = 'dashboard_inspector.html';
      } else if (usuarioEncontrado.rol === 'apoderado') {
        window.location.href = 'dashboard_apoderado.html';
      } else {
        mensajeError.textContent = 'Rol no reconocido.';
      }
    } else {
      mensajeError.textContent = 'Correo o contraseña incorrectos.';
    }
  } catch (error) {
    console.error('Error al cargar usuarios:', error);
    mensajeError.textContent = 'Error interno, intente más tarde.';
  }
});
