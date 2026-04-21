import api from '../client'

export const commonApi = {
  // 获取区域列表
  getAreas: async () => {
    const response = await api.get('/areas')
    return response.data
  },

  // 获取科目列表
  getSubjects: async () => {
    const response = await api.get('/subjects')
    return response.data
  },

  // 获取学校列表
  getSchools: async () => {
    const response = await api.get('/schools')
    return response.data
  },
}
