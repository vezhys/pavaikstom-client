import { api } from './api'
import { useAuthStore } from '../stores/auth';

export const authService = {
  async login(username: any, password: any) {
    const response = await api.post('/Auth/login', { username, password })
    const { accessToken, refreshToken } = response.data
    localStorage.setItem('token', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    return response.data
  },

  async logout() {
    localStorage.removeItem('token')
    const refreshToken = localStorage.getItem('refreshToken')
    localStorage.removeItem('refreshToken')
    const response = await api.post('/auth/logout', {refreshToken})


  // Remove Axios default header if used
     delete api.defaults.headers.common['Authorization'];
    return response.data
  },
  async register(username: string, email: string, password: string, role: string) {
    const response = await api.post('/auth/register', {
      userName: username,
      email: email,
      password: password,
      role: role,
    })
    const { accessToken, refreshToken } = response.data
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    return response.data
  },

  IsAuthenticated() { 
    const authStore = useAuthStore();
      return authStore.isAuthenticated
  },

  getToken() {
    return localStorage.getItem('token')
  },

  async refresh(){
     const response = await api.post('/refresh', {}, { withCredentials: true });
  }
}
