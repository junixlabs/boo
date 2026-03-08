# LifeStack - Implementation Plan

## Phase 1 - MVP (Core Daily Operations) -- COMPLETE

### 1.1 Backend Setup
- [x] Init Laravel project
- [x] Configure PostgreSQL connection
- [x] Setup JWT Auth (php-open-source-saver/jwt-auth)
- [x] Setup API versioning (route prefix /api/v1)
- [x] Configure CORS for SPA
- [x] Enums (ProjectType, ProjectStatus, TaskStatus, TaskPriority, IdeaStatus)
- [x] Global error handling (bootstrap/app.php: 404, 403, 401)
- [x] ApiResponse trait (success, created, noContent)

### 1.2 Auth Module
- [x] Create User migration (add timezone column)
- [x] POST /auth/register
- [x] POST /auth/login
- [x] POST /auth/logout
- [x] POST /auth/refresh
- [x] GET /auth/me
- [x] PUT /auth/profile
- [x] Auth middleware setup (redirectGuestsTo returns null for api/*)

### 1.3 Projects Module
- [x] Create projects migration (with soft deletes)
- [x] Project model + enums + query scopes (filterByStatus, filterByType)
- [x] ProjectPolicy (view, update, delete)
- [x] GET /projects (with filters: status, type, sort, pagination)
- [x] POST /projects
- [x] GET /projects/{id} (with tasks_count, tasks_done_count)
- [x] PUT /projects/{id}
- [x] DELETE /projects/{id} (soft delete)
- [x] PATCH /projects/{id}/status
- [x] FormRequest: StoreProjectRequest, UpdateProjectRequest, UpdateProjectStatusRequest
- [x] ProjectResource

### 1.4 Tasks Module
- [x] Create tasks migration
- [x] Task model + enums + query scopes (filterByProject, filterByStatus, filterByPriority, dueBetween)
- [x] TaskPolicy (view, update, delete)
- [x] GET /tasks (with filters: project_id, status, priority, due_date_from/to, pagination)
- [x] POST /tasks
- [x] GET /tasks/{id} (with project relation)
- [x] PUT /tasks/{id}
- [x] PATCH /tasks/{id}/status (auto completed_at)
- [x] DELETE /tasks/{id}
- [x] FormRequest: StoreTaskRequest, UpdateTaskRequest, UpdateTaskStatusRequest
- [x] TaskResource (includes is_focused_today, project relation)

### 1.5 Daily Focus Module
- [x] Create daily_focuses migration
- [x] DailyFocus model (custom $table = 'daily_focuses')
- [x] DailyFocusPolicy
- [x] GET /daily-focus?date= (default today)
- [x] POST /daily-focus (max 3 validation)
- [x] PUT /daily-focus/{id}
- [x] DELETE /daily-focus/{id}
- [x] POST /daily-focus/reorder
- [x] FormRequest: StoreDailyFocusRequest, UpdateDailyFocusRequest, ReorderDailyFocusRequest
- [x] DailyFocusResource

### 1.6 Ideas Module
- [x] Create ideas migration
- [x] Idea model + IdeaStatus enum
- [x] IdeaPolicy
- [x] GET /ideas (with filters: status, category)
- [x] POST /ideas
- [x] PUT /ideas/{id}
- [x] DELETE /ideas/{id}
- [x] POST /ideas/{id}/convert (to project or task)
- [x] PATCH /ideas/{id}/discard
- [x] FormRequest: StoreIdeaRequest, UpdateIdeaRequest, ConvertIdeaRequest
- [x] IdeaResource

### 1.7 Dashboard
- [x] GET /dashboard/today (daily_focuses, active_projects, overdue_tasks, recent_ideas_count, tasks_completed_this_week)
- [x] DashboardService (timezone-aware)

### 1.8 API Documentation
- [x] Install and configure Scramble (dedoc/scramble)
- [x] Install Scalar UI (scalar/laravel)
- [x] Auto-generated docs at /docs/api
- [x] OpenAPI JSON at /docs/api.json

### 1.9 Frontend
- [x] Complete (Feature-Based architecture, all modules built, drag & drop reorder)

**Phase 1 Summary: 30 routes, 38 tests passing, 6 controllers, 12 FormRequests, 5 Resources, 5 Services, 5 Models, 4 Policies, 5 Enums**

---

## Phase 2 - Planning & Direction -- COMPLETE

### 2.1 Life Direction Module
- [x] Create life_directions migration
- [x] LifeDirection model (1:1 with user, upsert pattern)
- [x] GET /life-direction (aggregate: vision + goals + focus_areas)
- [x] PUT /life-direction/vision

### 2.2 Goals Module
- [x] Create goals migration
- [x] Goal model + GoalTimeframe enum + GoalStatus enum
- [x] GoalPolicy
- [x] GET /goals (filters: timeframe, status)
- [x] POST /goals
- [x] PUT /goals/{id}
- [x] DELETE /goals/{id}
- [x] FormRequest: StoreGoalRequest, UpdateGoalRequest
- [x] GoalResource

### 2.3 Focus Areas Module
- [x] Create focus_areas migration
- [x] FocusArea model
- [x] FocusAreaPolicy
- [x] GET /focus-areas (filter: is_active)
- [x] POST /focus-areas
- [x] PUT /focus-areas/{id}
- [x] DELETE /focus-areas/{id}
- [x] FormRequest: StoreFocusAreaRequest, UpdateFocusAreaRequest
- [x] FocusAreaResource

### 2.4 Milestones Module
- [x] Create milestones migration + milestone FK on tasks
- [x] Milestone model + MilestoneStatus enum
- [x] MilestonePolicy (auth via project relationship)
- [x] GET /projects/{project}/milestones (filter: status)
- [x] POST /projects/{project}/milestones
- [x] PUT /milestones/{id}
- [x] PATCH /milestones/{id}/status (auto completed_at)
- [x] DELETE /milestones/{id}
- [x] FormRequest: StoreMilestoneRequest, UpdateMilestoneRequest, UpdateMilestoneStatusRequest
- [x] MilestoneResource (with tasks_count, tasks_done_count)

### 2.5 Weekly Planning Module
- [x] Create weekly_plans migration
- [x] WeeklyPlan model (unique: user_id + week_start)
- [x] WeeklyPlanPolicy
- [x] GET /weekly-plans (filter: week_start, defaults current week, auto tasks_completed)
- [x] POST /weekly-plans
- [x] PUT /weekly-plans/{id}
- [x] FormRequest: StoreWeeklyPlanRequest, UpdateWeeklyPlanRequest
- [x] WeeklyPlanResource

### 2.6 Project Notes Module
- [x] Create project_notes migration
- [x] ProjectNote model
- [x] ProjectNotePolicy
- [x] GET /projects/{project}/notes (paginated, sort)
- [x] POST /projects/{project}/notes
- [x] PUT /notes/{id}
- [x] DELETE /notes/{id}
- [x] FormRequest: StoreProjectNoteRequest, UpdateProjectNoteRequest
- [x] ProjectNoteResource

**Phase 2 Summary: 22 new routes (total 52), 7 migrations, 3 enums, 6 models, 6 controllers, 10 FormRequests, 5 Resources, 6 Services, 5 Policies**

---

## Phase 3 - Growth & Reflection -- COMPLETE

### 3.1 Skill Development Module
- [x] Create skill_categories migration
- [x] Create skills migration
- [x] Create learning_tasks migration
- [x] Create project_skill pivot migration
- [x] Models + relationships + enums (SkillLevel, LearningTaskStatus)
- [x] Skill Categories CRUD
- [x] Skills CRUD + link to projects (syncProjects)
- [x] Learning Tasks CRUD + status updates (auto completed_at)

### 3.2 Reflection Module
- [x] Create reflections migration
- [x] Reflection model + ReflectionType enum
- [x] GET /reflections (filter by type, paginated)
- [x] POST /reflections (weekly/monthly, unique per period)
- [x] PUT /reflections/{id}
- [x] DELETE /reflections/{id}

### 3.3 Frontend
- [x] Skill Categories (types, api, hooks)
- [x] Skills (types, api, hooks, SkillForm, SkillCard)
- [x] Learning Tasks (types, api, hooks, LearningTaskCard, LearningTaskForm)
- [x] Reflections (types, api, hooks, ReflectionForm, ReflectionCard)
- [x] SkillsPage + ReflectionsPage
- [x] Router + Sidebar updated

**Phase 3 Summary: 18 new routes (total 70), 5 migrations, 3 enums, 4 models, 4 controllers, 9 FormRequests, 4 Resources, 4 Services, 4 Policies**

---

## Phase 4 - Intelligence -- COMPLETE

### 4.1 Gemini AI Integration
- [x] Install laravel/ai SDK (requires PHP 8.3+)
- [x] 3 AI Agents: WeeklySummaryAgent, SuggestPrioritiesAgent, ReviewPromptAgent
- [x] AiService with context gathering + agent prompting
- [x] AiController (thin) with 3 FormRequests
- [x] POST /ai/weekly-summary
- [x] POST /ai/suggest-priorities
- [x] POST /ai/review-prompt
- [x] Rate limiting for AI endpoints (throttle:ai, 10/hour per user)

### 4.2 Enhanced Dashboard
- [x] GET /dashboard/overview (full aggregation with project health, skills, goals, notes)
- [x] Project health scoring logic (on_track / at_risk / blocked)

### 4.3 Git Integration
- [x] GitHubService (parse repo_url, call GitHub API, return simplified commits)
- [x] GitHubController with ProjectPolicy authorization
- [x] GET /projects/{project}/commits

### 4.4 Frontend
- [x] AI Assistant (types, api, hooks, AiPanel component)
- [x] AiPage
- [x] Router + Sidebar updated

**Phase 4 Summary: 5 new routes (total 75), 3 AI Agents, 2 new Services, 2 new Controllers, 3 FormRequests, 0 new models, 0 new migrations (SDK migration only)**
