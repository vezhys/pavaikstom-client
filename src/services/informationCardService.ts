import { api } from './api'

export const informationCardService = {
  async getAll() {
    const response = await api.get('/InfoCards')
    return response.data
  },

  async getById(id: any) {
    const response = await api.get(`/InfoCards/${id}`)
    return response.data
  },

  async getByPoiId(poiId: any) {
    const response = await api.get(`/POIs/${poiId}/InfoCards`)
    return response.data
  },

  async create(card: any) {
    const response = await api.post('/InfoCards', card)
    return response.data
  },

  async update(id: any, card: any) {
    const response = await api.put(`/InfoCards/${id}`, card)
    return response.data
  },

  async delete(id: any) {
    await api.delete(`/InfoCards/${id}`)
  },
  async getOwned() {
    const response = await api.get('/InfoCards/owned')
    return response.data
  },
}
