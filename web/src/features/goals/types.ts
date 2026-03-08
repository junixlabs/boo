export type GoalTimeframe = 'yearly' | 'quarterly'
export type GoalStatus = 'active' | 'completed' | 'dropped'

export interface Goal {
  id: number
  title: string
  description: string | null
  timeframe: GoalTimeframe
  status: GoalStatus
  target_date: string | null
  progress: number
  sort_order: number
  created_at: string
  updated_at: string
}

export interface GoalPayload {
  title: string
  description?: string | null
  timeframe: GoalTimeframe
  status?: GoalStatus
  target_date?: string | null
  progress?: number
  sort_order?: number
}

export interface GoalFilters {
  timeframe?: GoalTimeframe
  status?: GoalStatus
}
