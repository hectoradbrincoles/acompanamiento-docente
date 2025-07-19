// ✅ /frontend/axiosConfig.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🔐 Adjuntar token automáticamente si existe
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
