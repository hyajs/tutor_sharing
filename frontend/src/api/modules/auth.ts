import api from '../client'
import type { TokenResponse, CaptchaResponse, User } from '@/types'

export const authApi = {
  // 获取图形验证码
  getCaptcha: async (): Promise<CaptchaResponse> => {
    const response = await api.get('/auth/captcha')
    return response.data
  },

  // 注册
  register: async (data: {
    username: string
    email: string
    password: string
    captcha_code: string
    captcha_id: string
  }): Promise<TokenResponse> => {
    const response = await api.post('/auth/register', data)
    return response.data
  },

  // 登录
  login: async (data: {
    email: string
    password: string
    captcha_code?: string
    captcha_id?: string
  }): Promise<TokenResponse> => {
    const response = await api.post('/auth/login', data)
    return response.data
  },

  // 刷新Token
  refresh: async (refreshToken: string): Promise<TokenResponse> => {
    const response = await api.post('/auth/refresh', { refresh_token: refreshToken })
    return response.data
  },

  // 退出登录
  logout: async (): Promise<void> => {
    await api.post('/auth/logout')
  },

  // 获取当前用户信息
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/auth/me')
    return response.data
  },
}
