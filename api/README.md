# LifeStack API

RESTful API backend for LifeStack - a Personal Operating System for managing projects, tasks, daily focus, ideas, and more.

## Tech Stack

- **Framework**: Laravel 12
- **PHP**: >= 8.2
- **Database**: PostgreSQL
- **Auth**: JWT (`php-open-source-saver/jwt-auth`)
- **API Docs**: Scramble (auto-generated OpenAPI) + Scalar UI

## Getting Started

### Prerequisites

- PHP 8.2+
- Composer
- PostgreSQL

### Installation

```bash
# Clone and install dependencies
cd api
composer install

# Environment setup
cp .env.example .env
php artisan key:generate
php artisan jwt:secret
```

### Database Setup

Configure PostgreSQL in `.env`:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=lifestack
DB_USERNAME=your_user
DB_PASSWORD=your_password
```

Run migrations:

```bash
php artisan migrate
```

### Run Server

```bash
php artisan serve --port=8000
```

API available at `http://localhost:8000/api/v1`

### API Documentation

- **Interactive UI**: http://localhost:8000/docs/api
- **OpenAPI JSON**: http://localhost:8000/docs/api.json

### Run Tests

```bash
composer test
```

## Project Structure

```
app/
  Enums/                          # PHP backed enums
    IdeaStatus.php
    ProjectStatus.php
    ProjectType.php
    TaskPriority.php
    TaskStatus.php
  Http/
    Controllers/Api/V1/           # Thin controllers (delegate to services)
      AuthController.php
      DailyFocusController.php
      DashboardController.php
      IdeaController.php
      ProjectController.php
      TaskController.php
    Requests/                     # FormRequest validation classes
      ConvertIdeaRequest.php
      ReorderDailyFocusRequest.php
      StoreDailyFocusRequest.php
      StoreIdeaRequest.php
      StoreProjectRequest.php
      StoreTaskRequest.php
      UpdateDailyFocusRequest.php
      UpdateIdeaRequest.php
      UpdateProjectRequest.php
      UpdateProjectStatusRequest.php
      UpdateTaskRequest.php
      UpdateTaskStatusRequest.php
    Resources/                    # API Response serialization
      DailyFocusResource.php
      IdeaResource.php
      ProjectResource.php
      TaskResource.php
      UserResource.php
  Models/                         # Eloquent models with query scopes
    DailyFocus.php
    Idea.php
    Project.php
    Task.php
    User.php
  Policies/                       # Authorization (ownership checks)
    DailyFocusPolicy.php
    IdeaPolicy.php
    ProjectPolicy.php
    TaskPolicy.php
  Services/                       # Business logic layer
    DailyFocusService.php
    DashboardService.php
    IdeaService.php
    ProjectService.php
    TaskService.php
  Traits/
    ApiResponse.php               # Consistent JSON response helpers
bootstrap/
  app.php                         # Global error handling (404, 403, 401)
config/
  scramble.php                    # API docs configuration
routes/
  api.php                         # All API route definitions
```

## API Endpoints

All endpoints are prefixed with `/api/v1`. Protected endpoints require `Authorization: Bearer {token}` header.

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /auth/register | No | Register new user |
| POST | /auth/login | No | Login, returns JWT |
| POST | /auth/logout | Yes | Invalidate token |
| POST | /auth/refresh | Yes | Refresh JWT |
| GET | /auth/me | Yes | Current user profile |
| PUT | /auth/profile | Yes | Update name/timezone |

### Projects

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /projects | List (filters: status, type, sort, order, per_page) |
| POST | /projects | Create project |
| GET | /projects/{id} | Show with task counts |
| PUT | /projects/{id} | Update project |
| DELETE | /projects/{id} | Soft delete |
| PATCH | /projects/{id}/status | Change status |

### Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /tasks | List (filters: project_id, status, priority, due_date_from/to) |
| POST | /tasks | Create task (standalone or with project) |
| GET | /tasks/{id} | Show with project relation |
| PUT | /tasks/{id} | Update task |
| DELETE | /tasks/{id} | Delete task |
| PATCH | /tasks/{id}/status | Change status (auto-sets completed_at on done) |

### Daily Focus

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /daily-focus | List by date (default: today). Max 3 per day |
| POST | /daily-focus | Create focus item |
| PUT | /daily-focus/{id} | Update note/sort_order |
| DELETE | /daily-focus/{id} | Remove focus item |
| POST | /daily-focus/reorder | Reorder focus items |

### Ideas

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /ideas | List (filters: status, category) |
| POST | /ideas | Create idea (status: inbox) |
| PUT | /ideas/{id} | Update idea |
| DELETE | /ideas/{id} | Delete idea |
| POST | /ideas/{id}/convert | Convert to project or task |
| PATCH | /ideas/{id}/discard | Set status to discarded |

### Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /dashboard/today | Aggregated daily view |

## Response Format

Success:
```json
{ "data": { ... } }
```

Paginated:
```json
{ "data": [...], "links": {...}, "meta": { "current_page", "last_page", "per_page", "total" } }
```

Error:
```json
{ "message": "...", "errors": { "field": ["..."] } }
```

Status codes: `200` OK, `201` Created, `204` No Content, `401` Unauthenticated, `403` Forbidden, `404` Not Found, `422` Validation Error
