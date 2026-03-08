export type IdeaStatus = 'inbox' | 'converted' | 'discarded'

export interface Idea {
  id: number
  title: string
  description: string | null
  category: string | null
  status: IdeaStatus
  converted_to_type: string | null
  converted_to_id: number | null
  created_at: string
  updated_at: string
}

export interface IdeaPayload {
  title: string
  description?: string | null
  category?: string | null
}

export interface ConvertIdeaPayload {
  convert_to: 'project' | 'task'
  project_id?: number
}

export interface IdeaFilters {
  status?: IdeaStatus
  category?: string
  sort?: string
  order?: 'asc' | 'desc'
  page?: number
  per_page?: number
}
