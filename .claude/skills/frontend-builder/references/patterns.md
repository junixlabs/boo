# Frontend Code Patterns

## Table of Contents
- Type Definitions
- API Layer
- Query Hooks
- Components
- Page Composition
- Known Pitfalls

---

## Type Definitions

```ts
// src/features/{module}/types.ts

// Enum as union literal
export type TaskStatus = 'todo' | 'in_progress' | 'done' | 'cancelled'
export type TaskPriority = 'high' | 'medium' | 'low'

// Model - matches API Resource response exactly
export interface Task {
  id: number
  user_id: number
  project_id: number | null
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  due_date: string | null
  completed_at: string | null
  sort_order: number
  project: { id: number; title: string } | null  // nested relation
  is_focused_today: boolean
  created_at: string
  updated_at: string
}

// Payload - matches FormRequest fields
export interface TaskPayload {
  title: string
  description?: string | null
  project_id?: number | null
  status?: TaskStatus
  priority?: TaskPriority
  due_date?: string | null
}

// Filters - matches API query parameters
export interface TaskFilters {
  project_id?: number
  status?: string
  priority?: TaskPriority
  sort?: string
  order?: 'asc' | 'desc'
  page?: number
  per_page?: number
}
```

Shared response types are in `src/types/api.ts`:

```ts
export interface ApiResponse<T> { data: T }
export interface PaginatedResponse<T> {
  data: T[]
  meta: { current_page: number; last_page: number; per_page: number; total: number }
}
```

---

## API Layer

```ts
// src/features/{module}/api/{module}.api.ts
import api from '@/lib/axios'
import type { ApiResponse, PaginatedResponse } from '@/types/api'
import type { Task, TaskFilters, TaskPayload, TaskStatus } from '../types'

export const tasksApi = {
  list: (params?: TaskFilters) =>
    api.get<PaginatedResponse<Task>>('/tasks', { params }),

  get: (id: number) =>
    api.get<ApiResponse<Task>>(`/tasks/${id}`),

  create: (data: TaskPayload) =>
    api.post<ApiResponse<Task>>('/tasks', data),

  update: (id: number, data: Partial<TaskPayload>) =>
    api.put<ApiResponse<Task>>(`/tasks/${id}`, data),

  updateStatus: (id: number, status: TaskStatus) =>
    api.patch<ApiResponse<Task>>(`/tasks/${id}/status`, { status }),

  delete: (id: number) =>
    api.delete(`/tasks/${id}`),
}
```

---

## Query Hooks

```ts
// src/features/{module}/hooks/use{Module}.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { tasksApi } from '../api/tasks.api'
import type { TaskFilters, TaskPayload, TaskStatus } from '../types'

// Query key factory - ALWAYS export for cross-module invalidation
export const taskKeys = {
  all: ['tasks'] as const,
  list: (filters?: TaskFilters) => ['tasks', 'list', filters] as const,
  detail: (id: number) => ['tasks', id] as const,
}

// List query
export function useTasks(filters?: TaskFilters) {
  return useQuery({
    queryKey: taskKeys.list(filters),
    queryFn: () => tasksApi.list(filters).then((r) => r.data),
  })
}

// Detail query
export function useTask(id: number) {
  return useQuery({
    queryKey: taskKeys.detail(id),
    queryFn: () => tasksApi.get(id).then((r) => r.data.data),
  })
}

// Create mutation
export function useCreateTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: TaskPayload) => tasksApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: taskKeys.all })
      qc.invalidateQueries({ queryKey: projectKeys.all }) // cross-module
    },
  })
}

// Status change mutation - also invalidates dashboard
export function useUpdateTaskStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: TaskStatus }) =>
      tasksApi.updateStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: taskKeys.all })
      qc.invalidateQueries({ queryKey: projectKeys.all })
      qc.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}
```

Cross-module invalidation rules:
- Task CRUD -> invalidate `projectKeys.all` (task counts change)
- Task/Focus status change -> invalidate `['dashboard']`
- Idea convert -> invalidate `projectKeys.all` and `taskKeys.all`

---

## Components

### StatusBadge Pattern

Always map raw enum values to human-readable labels:

```tsx
// Dedicated component (preferred for reuse)
const statusConfig: Record<ProjectStatus, { label: string; variant: string }> = {
  active: { label: 'Active', variant: 'default' },
  paused: { label: 'Paused', variant: 'secondary' },
  completed: { label: 'Completed', variant: 'outline' },
  archived: { label: 'Archived', variant: 'secondary' },
}

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  const config = statusConfig[status]
  return <Badge variant={config.variant}>{config.label}</Badge>
}
```

```tsx
// Inline label map (acceptable for one-off usage)
<Badge variant="outline">
  {{ todo: 'To Do', in_progress: 'In Progress', done: 'Done', cancelled: 'Cancelled' }[task.status] ?? task.status}
</Badge>
```

### Form Pattern

```tsx
export function TaskForm({ initial, onSubmit, isPending }: TaskFormProps) {
  const [title, setTitle] = useState(initial?.title ?? '')
  // ... other fields

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit({ title, /* ... */ })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      {/* ... other fields */}
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? 'Saving...' : initial ? 'Update' : 'Create'}
      </Button>
    </form>
  )
}
```

### List + Empty State Pattern

```tsx
export function TaskList({ tasks, onStatusChange }: TaskListProps) {
  if (tasks.length === 0) {
    return <EmptyState icon={ListTodo} title="No tasks" description="Create your first task" />
  }
  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onStatusChange={onStatusChange} />
      ))}
    </div>
  )
}
```

---

## Page Composition

```tsx
// src/pages/{Module}Page.tsx - thin composition
export default function TasksPage() {
  const [statusFilter, setStatusFilter] = useState('all')
  const [createOpen, setCreateOpen] = useState(false)
  const [editTask, setEditTask] = useState<Task | null>(null)

  const filters = { ...(statusFilter !== 'all' && { status: statusFilter }) }
  const { data, isLoading } = useTasks(filters)
  const createTask = useCreateTask()

  return (
    <div className="space-y-6">
      <PageHeader title="Tasks" description="..." action={<Button>New Task</Button>} />
      {/* Filters */}
      {/* List or Loading */}
      {/* Create Dialog */}
      {/* Edit Dialog */}
    </div>
  )
}
```

---

## Known Pitfalls

### 1. Shadcn Select Label Bug (CRITICAL)

Shadcn UI v4 uses `@base-ui/react` Select. The `<SelectValue>` component cannot
auto-resolve item labels because items render inside a Portal that unmounts when closed.

WRONG:
```tsx
<SelectTrigger><SelectValue /></SelectTrigger>
```

CORRECT - pass explicit label as children:
```tsx
// Static options - use inline label map
<SelectTrigger>
  <SelectValue>
    {{ all: 'All Status', active: 'Active', paused: 'Paused' }[status]}
  </SelectValue>
</SelectTrigger>

// Dynamic options - look up from data array
<SelectTrigger>
  <SelectValue>
    {projectId ? projects.find(p => String(p.id) === projectId)?.title : 'No project'}
  </SelectValue>
</SelectTrigger>
```

### 2. Never Display Raw Enum Values

WRONG: `<Badge>{task.status}</Badge>` renders "in_progress"

CORRECT: Use a label map or dedicated StatusBadge component (see StatusBadge Pattern above).

### 3. base-ui vs Radix Differences

- `asChild` prop does NOT exist in base-ui. Style the trigger directly with className.
- `onValueChange` signature: `(value: string | null, event) => void`. Handle null:
  ```tsx
  onValueChange={(v) => setSomeState(v ?? 'default')}
  ```

### 4. Nested Module Routes

For modules nested under a parent (e.g., milestones under projects, notes under projects):
- Use URL params: `/projects/:projectId/milestones`
- Fetch parent ID from `useParams()`
- Can also be rendered as a section within the parent detail page instead of a separate route
