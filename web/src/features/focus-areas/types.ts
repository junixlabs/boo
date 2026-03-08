export interface FocusArea {
  id: number
  title: string
  description: string | null
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface FocusAreaPayload {
  title: string
  description?: string | null
  is_active?: boolean
  sort_order?: number
}

export interface FocusAreaFilters {
  is_active?: boolean
}
