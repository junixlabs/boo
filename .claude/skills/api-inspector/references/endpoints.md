# LifeStack API Endpoints Reference

Base URL: `http://localhost:8000/api/v1`
Auth: JWT Bearer token
Content-Type: `application/json`

## Table of Contents

- [Response Format](#response-format)
- [Auth](#auth)
- [Projects](#projects)
- [Tasks](#tasks)
- [Daily Focus](#daily-focus)
- [Ideas](#ideas)
- [Dashboard](#dashboard)

## Response Format

Success: `{ "data": { ... } }` or `{ "data": [...], "meta": { "current_page", "last_page", "per_page", "total" } }`
Error: `{ "message": "...", "errors": { "field": ["..."] } }`

Status codes: 200 OK, 201 Created, 204 No Content, 401 Unauthenticated, 403 Forbidden, 404 Not Found, 422 Validation Error

## Auth

| Method | Endpoint | Auth | Status | Notes |
|--------|----------|------|--------|-------|
| POST | /auth/register | No | 201 | Returns `data.user` + `data.token` + `data.token_type` + `data.expires_in` |
| POST | /auth/login | No | 200 | Same response as register |
| POST | /auth/logout | Yes | 204 | Invalidates current token |
| POST | /auth/refresh | Yes | 200 | Returns new token |
| GET | /auth/me | Yes | 200 | Returns `data` (UserResource) |
| PUT | /auth/profile | Yes | 200 | Fields: name, timezone |

### Register/Login request
```json
{"name": "string|required", "email": "string|email|required|unique", "password": "string|min:8|required", "password_confirmation": "string|required", "timezone": "string|optional"}
```

### Error cases
- Duplicate email: 422
- Wrong password: 422
- Missing required fields: 422
- No token: 401

## Projects

| Method | Endpoint | Status | Notes |
|--------|----------|--------|-------|
| GET | /projects | 200 | Paginated. Filters: `status`, `type`, `sort`, `order`, `page`, `per_page` |
| POST | /projects | 201 | Returns ProjectResource |
| GET | /projects/{id} | 200 | Includes `tasks_count`, `tasks_done_count` |
| PUT | /projects/{id} | 200 | Partial update |
| DELETE | /projects/{id} | 204 | |
| PATCH | /projects/{id}/status | 200 | Body: `{"status": "enum"}` |

### Create/Update request
```json
{"title": "required|max:255", "description": "nullable", "type": "required|enum:company,personal_startup,experiment,learning", "status": "enum:active,paused,completed,archived|default:active", "vision": "nullable", "priority": "int|1-5|default:3", "repo_url": "nullable|url", "start_date": "nullable|date", "target_date": "nullable|date|after_or_equal:start_date"}
```

## Tasks

| Method | Endpoint | Status | Notes |
|--------|----------|--------|-------|
| GET | /tasks | 200 | Paginated. Filters: `project_id`, `status`, `priority`, `due_date_from`, `due_date_to` |
| POST | /tasks | 201 | Returns TaskResource |
| GET | /tasks/{id} | 200 | Includes `project` relation |
| PUT | /tasks/{id} | 200 | Partial update |
| DELETE | /tasks/{id} | 204 | |
| PATCH | /tasks/{id}/status | 200 | Auto-sets `completed_at` when status=done |

### Create/Update request
```json
{"title": "required|max:255", "description": "nullable", "project_id": "nullable|exists:projects", "status": "enum:todo,in_progress,done,cancelled|default:todo", "priority": "enum:high,medium,low|default:medium", "due_date": "nullable|date", "sort_order": "int|default:0"}
```

## Daily Focus

Rule of 3: max 3 focus items per day.

| Method | Endpoint | Status | Notes |
|--------|----------|--------|-------|
| GET | /daily-focus | 200 | Filter: `date` (defaults to today). Returns with `task` relation |
| POST | /daily-focus | 201 | Max 3 per date enforced |
| PUT | /daily-focus/{id} | 200 | Fields: sort_order, note |
| DELETE | /daily-focus/{id} | 204 | |
| POST | /daily-focus/reorder | 200 | Body: `{"focus_date": "date", "order": [3,1,2]}` |

### Create request
```json
{"task_id": "required|exists:tasks", "focus_date": "date|default:today", "sort_order": "int|1-3|required", "note": "nullable"}
```

## Ideas

| Method | Endpoint | Status | Notes |
|--------|----------|--------|-------|
| GET | /ideas | 200 | Paginated. Filters: `status`, `category` |
| POST | /ideas | 201 | Status defaults to "inbox" |
| PUT | /ideas/{id} | 200 | |
| DELETE | /ideas/{id} | 204 | |
| POST | /ideas/{id}/convert | 200 | Converts idea to project or task |
| PATCH | /ideas/{id}/discard | 200 | Sets status to "discarded" |

### Create request
```json
{"title": "required|max:255", "description": "nullable", "category": "nullable|max:100"}
```

### Convert request
```json
{"convert_to": "required|enum:project,task", "project_id": "required_if:convert_to,task"}
```

## Dashboard

| Method | Endpoint | Status | Notes |
|--------|----------|--------|-------|
| GET | /dashboard/today | 200 | Aggregated view |

### Response keys
- `daily_focuses` - Today's focused tasks
- `active_projects` - Active projects with task counts
- `overdue_tasks` - Tasks past due date
- `recent_ideas_count` - Number of inbox ideas
- `tasks_completed_this_week` - Count of completed tasks this week
