import { api } from './api'

 export async function fetchCurrentUser() {
      try {
        const response = await api.get('/MyInfo')
        return response.data
      } catch (error) {
        console.error('Failed to fetch user', error)
      }
    }