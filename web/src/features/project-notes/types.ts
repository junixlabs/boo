export interface ProjectNote {
  id: number
  project_id: number
  title: string
  content: string
  created_at: string
  updated_at: string
}

export interface ProjectNotePayload {
  title: string
  content: string
}
