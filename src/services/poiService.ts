import { api } from './api'

export const poiService = {
  async getAll() {
    const response = await api.get('/POIs')
    return response.data
  },

  async getById(id: any) {
    const response = await api.get(`/POIs/${id}`)
    return response.data
  },

  async getByRouteId(tourId: any) {
    const response = await api.get(`/POIs/tour/${tourId}/`)
    return response.data
  },

  async create(poi: any) {
    const response = await api.post('/POIs', poi)
    return response.data
  },

  async update(id: any, poi: any) {
    const response = await api.put(`/POIs/${id}`, poi)
    return response.data
  },

  async delete(id: any) {
    await api.delete(`/POIs/${id}`)
  },

  async getOwned() {
    const response = await api.get('/POIs/owned')
    return response.data
  },
}
