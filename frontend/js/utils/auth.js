// ✅ /pages/js/utils/auth.js

// 🔐 Obtener el token desde localStorage
export function obtenerToken() {
  return localStorage.getItem('token');
}

// 🧠 Decodificar token JWT para acceder a info como id, rol, etc.
export function decodificarToken() {
  const token = obtenerToken();
  if (!token) return null;

  const payload = token.split('.')[1]; // Base64 del payload
  try {
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (err) {
    console.error('❌ Token no válido o corrupto:', err);
    return null;
  }
}
