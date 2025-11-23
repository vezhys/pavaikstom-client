import axios from 'axios';
import { useAuthStore } from '../stores/auth';

export const api = axios.create({
  baseURL: 'https://localhost:44367/api',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true,
});

axios.defaults.withCredentials = true;
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    // Prevent infinite loop by checking if we already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        console.log("retrieved refresh token: " + refreshToken)
        // Create a new axios instance WITHOUT interceptors for refresh call
        const refreshResponse = await axios.post(
          'https://localhost:44367/api/auth/refresh',
          { RefreshToken: refreshToken },
          { 
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
          }
        );
        
        const newAccessToken = refreshResponse.data.accessToken;
        localStorage.setItem('accessToken', newAccessToken);
        localStorage.setItem('refreshToken', refreshResponse.data.refreshToken);
        
        // Update the original request with new token
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        
        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        console.log("Refresh failed - logging out");
        const authStore = useAuthStore();
        authStore.logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);