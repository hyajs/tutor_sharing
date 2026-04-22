// Environment-based API selector
// In development or demo mode, use mock data instead of real API

import { mockApi } from '@/mock'
import api from '@/api/client'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || !import.meta.env.VITE_API_BASE_URL

export const apiClient = USE_MOCK ? mockApi : api

export const isUsingMock = USE_MOCK
