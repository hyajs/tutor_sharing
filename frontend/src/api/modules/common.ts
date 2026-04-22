import { apiClient } from '@/stores/mockStore'

export const commonApi = {
  // 获取区域列表
  getAreas: async () => {
    const response = await apiClient.get('/areas')
    return response.data
  },

  // 获取科目列表
  getSubjects: async () => {
    const response = await apiClient.get('/subjects')
    return response.data
  },

  // 获取学校列表
  getSchools: async () => {
    const response = await apiClient.get('/schools')
    return response.data
  },
}
