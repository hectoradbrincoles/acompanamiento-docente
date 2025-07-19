import axios from 'axios';

// Obtener la URL base desde las variables de entorno (VITE_API_URL)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Crear una instancia de Axios configurada con la URL base
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000, // Opcional: tiempo máximo para respuestas
  headers: {
    'Content-Type': 'application/json',
  },
});

// Ejemplo: función para obtener datos (ajusta la ruta según tu API)
export const obtenerDatos = () => {
  return apiClient.get('/datos');  // Cambia '/datos' por el endpoint que uses
};

// Exportar la instancia para usar en otros módulos
export default apiClient;
