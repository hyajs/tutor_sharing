import { apiClient } from '@/stores/mockStore'
import type { Tutor, SearchFilters } from '@/types'

export const tutorApi = {
  // 获取教员列表
  list: async (filters: SearchFilters = {}) => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value))
      }
    })
    const response = await apiClient.get(`/tutors?${params.toString()}`)
    return response.data
  },

  // 获取教员详情
  getById: async (id: number): Promise<Tutor> => {
    const response = await apiClient.get(`/tutors/${id}`)
    return response.data
  },

  // 申请成为教员
  apply: async (data: {
    name: string
    gender?: string
    age?: number
    school_id?: number
    major?: string
    grade?: string
    tutor_type: string
    teaching_age?: number
    hourly_rate?: number
    min_hourly_rate?: number
    longitude?: number
    latitude?: number
    introduction?: string
    teaching_experience?: string
    phone?: string
    wechat?: string
    subject_ids: number[]
    area_ids: number[]
  }): Promise<Tutor> => {
    const response = await apiClient.post('/tutors/apply', data)
    return response.data
  },

  // 获取我的教员资料
  getMyProfile: async (): Promise<Tutor> => {
    const response = await apiClient.get('/tutors/me/profile')
    return response.data
  },

  // 更新教员资料
  updateMyProfile: async (data: Partial<Tutor>): Promise<Tutor> => {
    const response = await apiClient.put('/tutors/me', data)
    return response.data
  },
}
