import axios from 'axios';

const apiBase = import.meta.env.VITE_API_BASE_URL 
  ? (import.meta.env.VITE_API_BASE_URL.endsWith('/api') ? import.meta.env.VITE_API_BASE_URL : `${import.meta.env.VITE_API_BASE_URL}/api`)
  : (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'http://localhost:5000/api' : '/api');

const api = axios.create({
  baseURL: apiBase,
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('skillswap_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Clean up token if unauthorized
      localStorage.removeItem('skillswap_token');
    }
    const message = error.response?.data?.message || 'Network request failed. Please check backend server.';
    return Promise.reject(new Error(message));
  }
);

export default api;
