import { api } from './api'

export const manageUsersService = {
  async getAll() {
    const response = await api.get('/Users')
    return response.data
  },

  async getById(id: any) {
    const response = await api.get(`/Users${id}`)
    return response.data
  },

  async create(user: any) {
    const response = await api.post('/Users', user)
    return response.data
  },

  async update(id: any, user: any) {
    const response = await api.put(`/Users/${id}`, user)
    return response.data
  },

  async delete(id: any) {
    await api.delete(`/Users/${id}`)
  }
}
