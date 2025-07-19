// 📁 frontend/js/login.js

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-login');
  const mensajeError = document.getElementById('mensaje-error');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    mensajeError.classList.add('d-none');

    const usuario = document.getElementById('usuario').value.trim();
    const contrasena = document.getElementById('contrasena').value;

    try {
      const res = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, contrasena })
      });

      const data = await res.json();

      console.log('✅ Respuesta del login:', data);
      console.log('🔎 Rol detectado:', data.rol);

      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('usuario', data.usuario);
        localStorage.setItem('rol', data.rol);
        localStorage.setItem('nombre', data.nombre);

        const rol = data.rol?.toLowerCase();

        switch (rol) {
          case 'administrador':
            window.location.href = '/pages/admin/dashboardAdmin.html'; // 🔄 nueva ruta
            break;
          case 'sub-admin':
            window.location.href = '/pages/panel.html';
            break;
          case 'coordinador':
            window.location.href = 'coordinador/dashboard.html';
            break;
          case 'docente':
            window.location.href = 'docente/dashboard.html';
            break;
          case 'evaluador':
            window.location.href = 'evaluador/dashboard.html';
            break;
          default:
            console.warn('⚠️ Rol no reconocido:', rol);
            window.location.href = 'login.html';
        }

      } else {
        mensajeError.textContent = data.error || 'Credenciales incorrectas';
        mensajeError.classList.remove('d-none');
      }

    } catch (err) {
      console.error('❌ Error de conexión:', err);
      mensajeError.textContent = 'Error de conexión con el servidor';
      mensajeError.classList.remove('d-none');
    }
  });
});
