import axios from 'axios';
import { useAuthStore } from '../stores/auth';

export const api = axios.create({
  baseURL: 'https://localhost:44367/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

axios.defaults.withCredentials = true; 
// Attach JWT automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  response => response,
  async error => {
    if (error.response.status === 401) {
      try {
        const refreshToken = localStorage.getItem('refreshToken')
        const res =  await axios.post('/api/refresh', {}, { withCredentials: true });
        const newAccessToken = res.data.access_token;
        localStorage.setItem('accessToken', newAccessToken);
        localStorage.setItem('refreshToken', res.data.access_token);
        error.config.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return axios(error.config); // retry original request
      } catch {
        // Refresh failed → log out user
        const authStore = useAuthStore();
        authStore.logout();
      }
    }
    return Promise.reject(error);
  }
);