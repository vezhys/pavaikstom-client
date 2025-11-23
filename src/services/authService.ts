import { api } from './api'
import { useAuthStore } from '../stores/auth';

export const authService = {
  async login(username: any, password: any) {
    const response = await api.post('/auth/login', { username, password })
    const { accessToken, refreshToken } = response.data
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    return response.data
  },

  async logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('accessToken')
    const refreshToken = localStorage.getItem('refreshToken')
    localStorage.removeItem('refreshToken')
    const response = await api.post('/auth/logout', {refreshToken})

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
    return localStorage.getItem('accessToken')
  },

  async refresh(){
      const oldRefreshToken = localStorage.getItem('refreshToken');
      console.log("sending refresh token:" + oldRefreshToken)
     const response = await api.post('/refresh', { refreshToken: oldRefreshToken });
     const { accessToken, refreshToken } = response.data
     localStorage.setItem('accessToken', accessToken)
     localStorage.setItem('refreshToken', refreshToken)
  }
}
