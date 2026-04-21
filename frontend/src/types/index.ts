// 用户类型
export interface User {
  id: number
  username: string
  email: string
  phone?: string
  wechat?: string
  user_type: 'parent' | 'tutor' | 'admin'
  avatar_url?: string
  status: number
  tutor_id?: number
}

// 教员类型
export interface Tutor {
  id: number
  user_id?: number
  name: string
  gender?: 'male' | 'female'
  age?: number
  school_id?: number
  major?: string
  grade?: string
  tutor_type: 'professional' | 'student' | 'foreign'
  teaching_age: number
  hourly_rate?: number
  min_hourly_rate?: number
  longitude?: number
  latitude?: number
  introduction?: string
  teaching_experience?: string
  phone?: string
  wechat?: string
  is_verified: boolean
  view_count: number
  favorite_count: number
  status: number
  created_at: string
  school?: School
  subjects?: Subject[]
  areas?: Area[]
}

// 科目
export interface Subject {
  id: number
  name: string
  level: number
}

// 区域
export interface Area {
  id: number
  name: string
}

// 学校
export interface School {
  id: number
  name: string
  city?: string
}

// 订单
export interface Order {
  id: number
  order_no: string
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
  subject_id?: number
  grade_level?: string
  teaching_mode?: 'online' | 'offline' | 'both'
  address?: string
  preferred_time?: string
  budget?: number
  feedback?: string
  rating?: number
  created_at: string
  tutor?: {
    id: number
    name: string
    phone?: string
  }
}

// 搜索筛选参数
export interface SearchFilters {
  keyword?: string
  area_id?: number
  subject_id?: number
  tutor_type?: string
  gender?: string
  school_id?: number
  min_price?: number
  max_price?: number
  is_verified?: boolean
  sort?: string
  order?: 'asc' | 'desc'
  page?: number
  page_size?: number
}

// API响应
export interface ApiResponse<T> {
  code: number
  message: string
  data?: T
}

// Token响应
export interface TokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
}

// 图形验证码
export interface CaptchaResponse {
  captcha_id: string
  image: string
}
