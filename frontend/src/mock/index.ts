// Mock API for development/demo
import { mockAreas, mockSubjects, mockSchools, mockTutors, mockTutorDetail } from './data'

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Mock API handlers
export const mockApi = {
  get: async (path: string) => {
    await delay(300) // Simulate network delay

    if (path === '/areas') {
      return { data: mockAreas }
    }
    if (path === '/subjects') {
      return { data: mockSubjects }
    }
    if (path === '/schools') {
      return { data: mockSchools }
    }
    if (path === '/tutors') {
      return {
        data: {
          items: mockTutors,
          total: mockTutors.length,
          page: 1,
          page_size: 10,
        }
      }
    }
    if (path.startsWith('/tutors/')) {
      return { data: mockTutorDetail }
    }

    throw new Error(`Mock API: Unknown path ${path}`)
  },
  post: async (_path: string, data?: unknown) => {
    await delay(300)
    // Return success for POST requests
    return { data: { success: true, ...data as object } }
  },
  put: async (_path: string, data?: unknown) => {
    await delay(300)
    return { data: { success: true, ...data as object } }
  },
  delete: async (_path: string) => {
    await delay(300)
    return { data: { success: true } }
  },
}

// Hook to use mock data in development
export const useMockData = () => {
  return {
    areas: mockAreas,
    subjects: mockSubjects,
    schools: mockSchools,
    tutors: mockTutors,
    tutorDetail: mockTutorDetail,
  }
}
