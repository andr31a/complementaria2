import axios from 'axios';
import useAuthStore from '../store/useAuthStore';

const PROD_URL = 'https://miune-docs-api.onrender.com/api';
const DEV_URL  = 'http://localhost:3000/api';

// Garantiza que la URL siempre termine en /api, sin importar cómo esté en Vercel
function buildBaseURL() {
  const raw = import.meta.env.VITE_API_URL;
  if (!raw) return import.meta.env.DEV ? DEV_URL : PROD_URL;
  return raw.endsWith('/api') ? raw : `${raw.replace(/\/$/, '')}/api`;
}

const api = axios.create({
  baseURL: buildBaseURL(),
});

// Request Interceptor: Adjunta el JWT token si existe en Zustand Store
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response Interceptor: Manejo de Caducidad de Token (401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login'; // Forzar reseteo de pantalla
    }
    return Promise.reject(error);
  }
);

export default api;
