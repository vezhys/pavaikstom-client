import { api } from './api'

export const itemService = {
  async getAll() {
    const response = await api.get('/tours')
    return response.data
  },

  async getById(id: any) {
    const response = await api.get(`/tours/${id}`)
    return response.data
  },

  async create(item: any) {
    const response = await api.post('/tours', item)
    return response.data
  },

  async update(id: any, item: any) {
    const response = await api.put(`/tours/${id}`, item)
    return response.data
  },

  async delete(id: any) {
    await api.delete(`/tours/${id}`)
  },
  async getOwned() {
    const response = await api.get('/tours/owned')
    return response.data
  },
}
