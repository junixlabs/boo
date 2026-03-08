# LifeStack - API Specifications

Base URL: `/api/v1`
Auth: JWT Bearer token (php-open-source-saver/jwt-auth)
Content-Type: `application/json`

## Standard Response Format

### Success
```json
{
  "data": { ... },
  "meta": { "current_page": 1, "last_page": 5, "per_page": 20, "total": 100 }
}
```

### Error
```json
{
  "message": "Validation failed",
  "errors": { "title": ["The title field is required."] }
}
```

### HTTP Status Codes
- 200: Success
- 201: Created
- 204: No Content (delete)
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 422: Validation Error
- 500: Server Error

---

## PHASE 1 - MVP

### Auth

#### POST /auth/register
```json
// Request
{ "name": "string", "email": "string", "password": "string", "password_confirmation": "string", "timezone": "Asia/Ho_Chi_Minh" }

// Response 201
{ "data": { "user": { "id": 1, "name": "...", "email": "...", "timezone": "..." }, "token": "plain-text-token" } }
```

#### POST /auth/login
```json
// Request
{ "email": "string", "password": "string" }

// Response 200
{ "data": { "user": { "id": 1, "name": "...", "email": "...", "timezone": "..." }, "token": "plain-text-token" } }
```

#### POST /auth/logout
```
// Headers: Authorization: Bearer {token}
// Response 204
```

#### GET /auth/me
```json
// Response 200
{ "data": { "id": 1, "name": "...", "email": "...", "timezone": "..." } }
```

#### PUT /auth/profile
```json
// Request
{ "name": "string", "timezone": "string" }

// Response 200
{ "data": { "id": 1, "name": "...", "email": "...", "timezone": "..." } }
```

---

### Projects

#### GET /projects
Query params: `?status=active&type=company&sort=priority&order=asc&page=1&per_page=20`

```json
// Response 200
{
  "data": [
    {
      "id": 1,
      "title": "LifeStack",
      "description": "Personal OS",
      "type": "personal_startup",
      "status": "active",
      "vision": "Build the best personal management tool",
      "priority": 1,
      "repo_url": "https://github.com/...",
      "start_date": "2026-03-07",
      "target_date": "2026-06-30",
      "tasks_count": 12,
      "tasks_done_count": 5,
      "created_at": "2026-03-07T00:00:00Z",
      "updated_at": "2026-03-07T00:00:00Z"
    }
  ],
  "meta": { ... }
}
```

#### POST /projects
```json
// Request
{
  "title": "string|required|max:255",
  "description": "string|nullable",
  "type": "enum:company,personal_startup,experiment,learning|required",
  "status": "enum:active,paused,completed,archived|default:active",
  "vision": "string|nullable",
  "priority": "int|1-5|default:3",
  "repo_url": "string|nullable|url|max:500",
  "start_date": "date|nullable",
  "target_date": "date|nullable|after_or_equal:start_date"
}

// Response 201
{ "data": { ... } }
```

#### GET /projects/{id}
```json
// Response 200 - includes recent tasks and milestones summary
{
  "data": {
    "id": 1,
    "title": "...",
    "description": "...",
    "type": "...",
    "status": "...",
    "vision": "...",
    "priority": 1,
    "repo_url": "...",
    "start_date": "...",
    "target_date": "...",
    "tasks_count": 12,
    "tasks_done_count": 5,
    "milestones_count": 3,
    "milestones_done_count": 1,
    "created_at": "...",
    "updated_at": "..."
  }
}
```

#### PUT /projects/{id}
```json
// Request - same fields as POST, all optional
// Response 200
{ "data": { ... } }
```

#### DELETE /projects/{id}
```
// Soft delete
// Response 204
```

#### PATCH /projects/{id}/status
```json
// Request
{ "status": "enum:active,paused,completed,archived" }

// Response 200
{ "data": { ... } }
```

---

### Tasks

#### GET /tasks
Query params: `?project_id=1&status=todo,in_progress&priority=high&due_date_from=2026-03-07&due_date_to=2026-03-14&sort=due_date&order=asc&page=1&per_page=20`

```json
// Response 200
{
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "project_id": 1,
      "milestone_id": null,
      "title": "Design database schema",
      "description": "...",
      "status": "done",
      "priority": "high",
      "due_date": "2026-03-10",
      "completed_at": "2026-03-09T14:00:00Z",
      "sort_order": 0,
      "project": { "id": 1, "title": "LifeStack" },
      "is_focused_today": true,
      "created_at": "...",
      "updated_at": "..."
    }
  ],
  "meta": { ... }
}
```

#### POST /tasks
```json
// Request
{
  "title": "string|required|max:255",
  "description": "string|nullable",
  "project_id": "int|nullable|exists:projects",
  "milestone_id": "int|nullable|exists:milestones",
  "status": "enum:todo,in_progress,done,cancelled|default:todo",
  "priority": "enum:high,medium,low|default:medium",
  "due_date": "date|nullable",
  "sort_order": "int|default:0"
}

// Response 201
{ "data": { ... } }
```

#### GET /tasks/{id}
```json
// Response 200
{ "data": { ... } }
```

#### PUT /tasks/{id}
```json
// Request - same fields as POST, all optional
// Response 200
{ "data": { ... } }
```

#### PATCH /tasks/{id}/status
```json
// Request
{ "status": "enum:todo,in_progress,done,cancelled" }

// Response 200 (auto-sets completed_at when status=done)
{ "data": { ... } }
```

#### DELETE /tasks/{id}
```
// Hard delete
// Response 204
```

---

### Daily Focus (Rule of 3)

#### GET /daily-focus
Query params: `?date=2026-03-07` (defaults to today based on user timezone)

```json
// Response 200
{
  "data": [
    {
      "id": 1,
      "task_id": 5,
      "focus_date": "2026-03-07",
      "sort_order": 1,
      "note": "Finish by noon",
      "task": {
        "id": 5,
        "title": "Design database schema",
        "status": "in_progress",
        "priority": "high",
        "project": { "id": 1, "title": "LifeStack" }
      }
    }
  ]
}
```

#### POST /daily-focus
```json
// Request
{
  "task_id": "int|required|exists:tasks",
  "focus_date": "date|default:today",
  "sort_order": "int|1-3|required",
  "note": "string|nullable"
}

// Response 201
// Validation: max 3 focuses per day
{ "data": { ... } }
```

#### PUT /daily-focus/{id}
```json
// Request
{ "sort_order": "int|1-3", "note": "string|nullable" }

// Response 200
{ "data": { ... } }
```

#### DELETE /daily-focus/{id}
```
// Response 204
```

#### POST /daily-focus/reorder
```json
// Request - reorder all focuses for a date
{ "focus_date": "2026-03-07", "order": [3, 1, 2] }

// Response 200
{ "data": [ ... ] }
```

---

### Ideas (Inbox)

#### GET /ideas
Query params: `?status=inbox&category=product&sort=created_at&order=desc&page=1&per_page=20`

```json
// Response 200
{
  "data": [
    {
      "id": 1,
      "title": "AI-powered code review tool",
      "description": "Build a tool that...",
      "category": "product",
      "status": "inbox",
      "converted_to_type": null,
      "converted_to_id": null,
      "created_at": "...",
      "updated_at": "..."
    }
  ],
  "meta": { ... }
}
```

#### POST /ideas
```json
// Request
{
  "title": "string|required|max:255",
  "description": "string|nullable",
  "category": "string|nullable|max:100"
}

// Response 201
{ "data": { ... } }
```

#### PUT /ideas/{id}
```json
// Request - same as POST, all optional
// Response 200
{ "data": { ... } }
```

#### DELETE /ideas/{id}
```
// Response 204
```

#### POST /ideas/{id}/convert
```json
// Request
{
  "convert_to": "enum:project,task|required",
  "project_id": "int|nullable|required_if:convert_to,task"
}

// Response 200 - returns the created project or task
// Idea status changes to 'converted', converted_to_type and converted_to_id are set
{
  "data": {
    "idea": { ... },
    "created": { ... }
  }
}
```

#### PATCH /ideas/{id}/discard
```json
// Response 200 - sets status to 'discarded'
{ "data": { ... } }
```

---

### Dashboard

#### GET /dashboard/today
```json
// Response 200
{
  "data": {
    "date": "2026-03-07",
    "daily_focuses": [
      {
        "id": 1,
        "sort_order": 1,
        "note": "...",
        "task": { "id": 5, "title": "...", "status": "in_progress", "project": { "id": 1, "title": "..." } }
      }
    ],
    "active_projects": [
      { "id": 1, "title": "LifeStack", "type": "personal_startup", "priority": 1, "tasks_count": 12, "tasks_done_count": 5 }
    ],
    "overdue_tasks": [
      { "id": 3, "title": "...", "due_date": "2026-03-05", "project": { "id": 1, "title": "..." } }
    ],
    "recent_ideas_count": 5,
    "tasks_completed_this_week": 8
  }
}
```

---

## PHASE 2 - Planning & Direction

### Life Direction

#### GET /life-direction
```json
// Response 200
{
  "data": {
    "vision": "Become a world-class engineer and entrepreneur...",
    "goals": [
      { "id": 1, "title": "Launch LifeStack", "timeframe": "quarterly", "status": "active", "target_date": "2026-06-30", "sort_order": 1 }
    ],
    "focus_areas": [
      { "id": 1, "title": "AI Engineering", "description": "...", "is_active": true, "sort_order": 1 }
    ],
    "updated_at": "..."
  }
}
```

#### PUT /life-direction/vision
```json
// Request
{ "vision": "string|required" }

// Response 200
{ "data": { "vision": "...", "updated_at": "..." } }
```

### Goals

#### GET /goals
Query params: `?timeframe=quarterly&status=active`

```json
// Response 200
{ "data": [ { "id": 1, "title": "...", "description": "...", "timeframe": "quarterly", "status": "active", "target_date": "...", "sort_order": 1 } ] }
```

#### POST /goals
```json
// Request
{
  "title": "string|required|max:255",
  "description": "string|nullable",
  "timeframe": "enum:yearly,quarterly|required",
  "status": "enum:active,completed,dropped|default:active",
  "target_date": "date|nullable",
  "sort_order": "int|default:0"
}

// Response 201
```

#### PUT /goals/{id}
```json
// Request - same as POST, all optional
// Response 200
```

#### DELETE /goals/{id}
```
// Response 204
```

### Focus Areas

#### GET /focus-areas
Query params: `?is_active=true`

```json
// Response 200
{ "data": [ { "id": 1, "title": "AI Engineering", "description": "...", "is_active": true, "sort_order": 1 } ] }
```

#### POST /focus-areas
```json
{ "title": "string|required|max:255", "description": "string|nullable", "is_active": "boolean|default:true", "sort_order": "int|default:0" }
// Response 201
```

#### PUT /focus-areas/{id}
```json
// Response 200
```

#### DELETE /focus-areas/{id}
```
// Response 204
```

### Milestones

#### GET /projects/{projectId}/milestones
Query params: `?status=pending,in_progress`

```json
// Response 200
{
  "data": [
    {
      "id": 1,
      "project_id": 1,
      "title": "MVP Launch",
      "description": "...",
      "status": "in_progress",
      "target_date": "2026-04-30",
      "completed_at": null,
      "sort_order": 1,
      "tasks_count": 5,
      "tasks_done_count": 2
    }
  ]
}
```

#### POST /projects/{projectId}/milestones
```json
{
  "title": "string|required|max:255",
  "description": "string|nullable",
  "status": "enum:pending,in_progress,completed|default:pending",
  "target_date": "date|nullable",
  "sort_order": "int|default:0"
}
// Response 201
```

#### PUT /milestones/{id}
```json
// Response 200
```

#### PATCH /milestones/{id}/status
```json
{ "status": "enum:pending,in_progress,completed" }
// Auto-sets completed_at when status=completed
// Response 200
```

#### DELETE /milestones/{id}
```
// Response 204
```

### Weekly Plans

#### GET /weekly-plans
Query params: `?week_start=2026-03-03` (defaults to current week)

```json
// Response 200
{
  "data": {
    "id": 1,
    "week_start": "2026-03-03",
    "completed_summary": "Finished DB design, API specs...",
    "blocked_summary": "Waiting for design review...",
    "next_summary": "Start Phase 1 implementation...",
    "tasks_completed_this_week": [
      { "id": 5, "title": "...", "completed_at": "...", "project": { "id": 1, "title": "..." } }
    ],
    "created_at": "...",
    "updated_at": "..."
  }
}
```

#### POST /weekly-plans
```json
{
  "week_start": "date|required",
  "completed_summary": "string|nullable",
  "blocked_summary": "string|nullable",
  "next_summary": "string|nullable"
}
// Response 201
```

#### PUT /weekly-plans/{id}
```json
// Response 200
```

### Project Notes

#### GET /projects/{projectId}/notes
Query params: `?sort=created_at&order=desc&page=1&per_page=20`

```json
// Response 200
{ "data": [ { "id": 1, "project_id": 1, "title": "Architecture decisions", "content": "...", "created_at": "...", "updated_at": "..." } ], "meta": { ... } }
```

#### POST /projects/{projectId}/notes
```json
{ "title": "string|required|max:255", "content": "string|required" }
// Response 201
```

#### PUT /notes/{id}
```json
// Response 200
```

#### DELETE /notes/{id}
```
// Response 204
```

---

## PHASE 3 - Growth & Reflection

### Skill Categories

#### GET /skill-categories
```json
// Response 200
{
  "data": [
    {
      "id": 1,
      "name": "Engineering",
      "sort_order": 1,
      "skills_count": 4,
      "skills": [
        { "id": 1, "name": "System Design", "current_level": "intermediate", "target_level": "expert" }
      ]
    }
  ]
}
```

#### POST /skill-categories
```json
{ "name": "string|required|max:255", "sort_order": "int|default:0" }
// Response 201
```

#### PUT /skill-categories/{id}
```json
// Response 200
```

#### DELETE /skill-categories/{id}
```
// Cascade deletes skills and learning_tasks
// Response 204
```

### Skills

#### GET /skills
Query params: `?category_id=1`

```json
// Response 200
{
  "data": [
    {
      "id": 1,
      "category_id": 1,
      "name": "System Design",
      "current_level": "intermediate",
      "target_level": "expert",
      "notes": "Focus on distributed systems...",
      "learning_tasks_count": 3,
      "learning_tasks_done_count": 1,
      "projects": [ { "id": 1, "title": "LifeStack" } ]
    }
  ]
}
```

#### POST /skills
```json
{
  "category_id": "int|required|exists:skill_categories",
  "name": "string|required|max:255",
  "current_level": "enum:beginner,intermediate,advanced,expert|default:beginner",
  "target_level": "enum:beginner,intermediate,advanced,expert|default:advanced",
  "notes": "string|nullable"
}
// Response 201
```

#### PUT /skills/{id}
```json
// Response 200
```

#### DELETE /skills/{id}
```
// Response 204
```

#### POST /skills/{id}/projects
```json
// Link skill to projects
{ "project_ids": [1, 2] }
// Response 200
```

### Learning Tasks

#### GET /skills/{skillId}/learning-tasks
Query params: `?status=todo,in_progress`

```json
// Response 200
{
  "data": [
    {
      "id": 1,
      "skill_id": 1,
      "title": "Study distributed systems",
      "description": "Read DDIA book chapters 5-9",
      "status": "in_progress",
      "resource_url": "https://...",
      "completed_at": null
    }
  ]
}
```

#### POST /skills/{skillId}/learning-tasks
```json
{
  "title": "string|required|max:255",
  "description": "string|nullable",
  "status": "enum:todo,in_progress,done|default:todo",
  "resource_url": "string|nullable|url|max:500"
}
// Response 201
```

#### PUT /learning-tasks/{id}
```json
// Response 200
```

#### PATCH /learning-tasks/{id}/status
```json
{ "status": "enum:todo,in_progress,done" }
// Auto-sets completed_at when done
// Response 200
```

#### DELETE /learning-tasks/{id}
```
// Response 204
```

### Reflections

#### GET /reflections
Query params: `?type=weekly&sort=period_start&order=desc&page=1&per_page=10`

```json
// Response 200
{
  "data": [
    {
      "id": 1,
      "type": "weekly",
      "period_start": "2026-03-03",
      "period_end": "2026-03-09",
      "went_well": "Completed API specs, good focus...",
      "went_wrong": "Spent too much time on UI details...",
      "to_improve": "Time-box design decisions...",
      "projects_progress": null,
      "skills_improved": null,
      "mistakes": null,
      "opportunities": null,
      "created_at": "...",
      "updated_at": "..."
    }
  ],
  "meta": { ... }
}
```

#### POST /reflections
```json
{
  "type": "enum:weekly,monthly|required",
  "period_start": "date|required",
  "period_end": "date|required|after:period_start",
  "went_well": "string|nullable",
  "went_wrong": "string|nullable",
  "to_improve": "string|nullable",
  "projects_progress": "string|nullable",
  "skills_improved": "string|nullable",
  "mistakes": "string|nullable",
  "opportunities": "string|nullable"
}
// Response 201
```

#### PUT /reflections/{id}
```json
// Response 200
```

#### DELETE /reflections/{id}
```
// Response 204
```

---

## PHASE 4 - Intelligence

### AI Endpoints

#### POST /ai/weekly-summary
```json
// Request
{ "week_start": "2026-03-03" }

// Response 200 - AI-generated summary from task/project data
{
  "data": {
    "summary": "This week you completed 8 tasks across 3 projects...",
    "highlights": ["Completed DB design for LifeStack", "..."],
    "concerns": ["2 tasks overdue in Project X", "..."],
    "suggestions": ["Consider pausing Project Y to focus on...", "..."]
  }
}
```

#### POST /ai/suggest-priorities
```json
// Request
{ "date": "2026-03-07" }

// Response 200
{
  "data": {
    "suggested_focuses": [
      { "task_id": 5, "reason": "High priority, due tomorrow" },
      { "task_id": 8, "reason": "Blocked for 3 days, needs attention" },
      { "task_id": 12, "reason": "Quick win, builds momentum" }
    ]
  }
}
```

#### POST /ai/review-prompt
```json
// Request
{ "type": "weekly", "period_start": "2026-03-03" }

// Response 200 - AI generates prompts/questions based on the week's data
{
  "data": {
    "prompts": [
      "You completed 5/8 planned tasks. What blocked the other 3?",
      "Project LifeStack had the most activity. Is this aligned with your Q1 goals?",
      "You haven't worked on skill 'DevOps' in 2 weeks. Still a priority?"
    ]
  }
}
```

### Dashboard Overview (Enhanced)

#### GET /dashboard/overview
```json
// Response 200
{
  "data": {
    "today_focus": [ ... ],
    "active_projects": [ ... ],
    "weekly_goals": { "completed": 5, "total": 8 },
    "skill_progress": [
      { "name": "System Design", "current_level": "intermediate", "target_level": "expert", "recent_learning_tasks": 2 }
    ],
    "recent_notes": [ ... ],
    "ideas_inbox_count": 7,
    "overdue_tasks_count": 2,
    "project_health": [
      { "project_id": 1, "title": "LifeStack", "health": "on_track", "completion_pct": 42 }
    ]
  }
}
```
