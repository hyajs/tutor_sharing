import { create } from 'zustand'
import type { SearchFilters } from '@/types'

interface SearchState {
  filters: SearchFilters
  setFilters: (filters: Partial<SearchFilters>) => void
  resetFilters: () => void
}

const defaultFilters: SearchFilters = {
  sort: 'created_at',
  order: 'desc',
  page: 1,
  page_size: 20,
}

export const useSearchStore = create<SearchState>((set) => ({
  filters: defaultFilters,

  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),

  resetFilters: () => set({ filters: defaultFilters }),
}))
