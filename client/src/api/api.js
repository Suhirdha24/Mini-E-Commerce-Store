import axios from 'axios';

const getBaseUrl = () => {
  let envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl || envUrl.trim() === '') {
    return 'http://localhost:5000/api';
  }
  envUrl = envUrl.trim();
  if (envUrl.endsWith('/')) {
    envUrl = envUrl.slice(0, -1);
  }
  if (!envUrl.endsWith('/api')) {
    envUrl = `${envUrl}/api`;
  }
  return envUrl;
};

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;