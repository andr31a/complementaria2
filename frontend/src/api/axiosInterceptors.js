import axios from 'axios';
import useAuthStore from '../store/useAuthStore';

const PROD_URL = 'https://miune-docs-api.onrender.com/api';
const DEV_URL  = 'http://localhost:3000/api';
const BASE_URL = import.meta.env.VITE_API_URL
  || (import.meta.env.DEV ? DEV_URL : PROD_URL);

const api = axios.create({
  baseURL: BASE_URL,
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
