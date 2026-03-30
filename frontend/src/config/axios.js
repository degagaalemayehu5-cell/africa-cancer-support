import axios from 'axios';

// Use relative path for production (same server), full URL for development
const API_URL = import.meta.env.PROD ? '/api' : '/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Add request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    console.log(`📤 Making request to: ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`📥 Response received: ${response.status}`);
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.status, error.message);
    return Promise.reject(error);
  }
);

export default axiosInstance;