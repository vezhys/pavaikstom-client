import { defineStore } from 'pinia'
import { authService } from '../services/authService'
import { fetchCurrentUser } from '../services/userService'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as null | { username: string; email: string; role: string },
    isAuthenticated: !!authService.getToken(),
  }),

  getters: {
    //isAuthenticated: (state) => !!state.user || !!authService.getToken(),
    canManage(state) {
      const role = state.user?.role
      return role === 'Admin' || role === 'Guide'
    },
    canManageUsers(state) {
      const role = state.user?.role
      return role === 'Admin'
    },
  },
  actions: {
    async login(username: string, password: string) {
      try {
        const data = await authService.login(username, password)
        this.isAuthenticated = true
        await this.fetchCurrentUser()

        return true
      } catch (error) {
        throw error
      }
    },
    async register(username: string, email: string, password: string, role: string) {
      try {
        const data = await authService.register(username, email, password, role)
        this.isAuthenticated = true
        await this.fetchCurrentUser()
        return true
      } catch (error) {
        throw error
      }
    },

    logout() {
      this.user = null
      this.isAuthenticated = false
      authService.logout()
    },

    async fetchCurrentUser() {
      try {
        const userData = await fetchCurrentUser()
        this.user = {
          username: userData.userName,
          email: userData.email,
          role: userData.role,
        }
      } catch (error) {
        console.error('Failed to fetch user', error)
        this.user = null
        this.isAuthenticated = false
      }
    },

    async refreshToken() {
      try {
        authService.refresh();
        this.isAuthenticated = true;
      } catch (err) {
        this.isAuthenticated = false;

      }
    },
  },
})
