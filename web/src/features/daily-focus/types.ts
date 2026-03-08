export interface DailyFocus {
  id: number
  task_id: number
  focus_date: string
  sort_order: number
  note: string | null
  task: {
    id: number
    title: string
    status: string
    priority: string
    project: { id: number; title: string } | null
  }
}

export interface DailyFocusPayload {
  task_id: number
  focus_date?: string
  sort_order: number
  note?: string | null
}

export interface ReorderPayload {
  focus_date: string
  order: number[]
}

export interface FocusSuggestion {
  task: {
    id: number
    title: string
    status: string
    priority: string
    due_date: string | null
    project: { id: number; title: string } | null
  }
  score: number
  reasons: string[]
}
