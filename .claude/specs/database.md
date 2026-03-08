# LifeStack - Database Design

## ER Overview

```
users
  |-- life_directions (1:1)
  |-- goals (1:N)
  |-- focus_areas (1:N)
  |-- projects (1:N)
  |     |-- milestones (1:N)
  |     |     |-- tasks (1:N)
  |     |-- tasks (1:N, direct)
  |     |-- project_notes (1:N)
  |     |-- project_skill (N:N pivot)
  |-- tasks (1:N, standalone)
  |     |-- daily_focuses (1:N)
  |-- skills (1:N)
  |     |-- learning_tasks (1:N)
  |     |-- project_skill (N:N pivot)
  |-- ideas (1:N)
  |-- weekly_plans (1:N)
  |-- reflections (1:N)
```

## Tables

### users
| Column | Type | Notes |
|--------|------|-------|
| id | bigint PK | |
| name | varchar(255) | |
| email | varchar(255) | unique |
| password | varchar(255) | |
| timezone | varchar(50) | default 'UTC' |
| created_at | timestamp | |
| updated_at | timestamp | |

### life_directions (Phase 2)
| Column | Type | Notes |
|--------|------|-------|
| id | bigint PK | |
| user_id | bigint FK | unique, one per user |
| vision | text | Long-term personal vision |
| updated_at | timestamp | |

### goals (Phase 2)
| Column | Type | Notes |
|--------|------|-------|
| id | bigint PK | |
| user_id | bigint FK | |
| title | varchar(255) | |
| description | text | nullable |
| timeframe | enum | 'yearly', 'quarterly' |
| status | enum | 'active', 'completed', 'dropped' |
| target_date | date | nullable |
| sort_order | int | default 0 |
| created_at | timestamp | |
| updated_at | timestamp | |

### focus_areas (Phase 2)
| Column | Type | Notes |
|--------|------|-------|
| id | bigint PK | |
| user_id | bigint FK | |
| title | varchar(255) | |
| description | text | nullable |
| is_active | boolean | default true |
| sort_order | int | default 0 |
| created_at | timestamp | |
| updated_at | timestamp | |

### projects (Phase 1)
| Column | Type | Notes |
|--------|------|-------|
| id | bigint PK | |
| user_id | bigint FK | |
| title | varchar(255) | |
| description | text | nullable |
| type | enum | 'company', 'personal_startup', 'experiment', 'learning' |
| status | enum | 'active', 'paused', 'completed', 'archived' |
| vision | text | nullable, project-level vision |
| priority | int | 1-5, lower = higher priority |
| repo_url | varchar(500) | nullable |
| start_date | date | nullable |
| target_date | date | nullable |
| created_at | timestamp | |
| updated_at | timestamp | |
| deleted_at | timestamp | nullable, soft delete |

### milestones (Phase 2)
| Column | Type | Notes |
|--------|------|-------|
| id | bigint PK | |
| project_id | bigint FK | |
| title | varchar(255) | |
| description | text | nullable |
| status | enum | 'pending', 'in_progress', 'completed' |
| target_date | date | nullable |
| completed_at | timestamp | nullable |
| sort_order | int | default 0 |
| created_at | timestamp | |
| updated_at | timestamp | |

### tasks (Phase 1)
| Column | Type | Notes |
|--------|------|-------|
| id | bigint PK | |
| user_id | bigint FK | |
| project_id | bigint FK | nullable, standalone if null |
| milestone_id | bigint FK | nullable |
| title | varchar(255) | |
| description | text | nullable |
| status | enum | 'todo', 'in_progress', 'done', 'cancelled' |
| priority | enum | 'high', 'medium', 'low' |
| due_date | date | nullable |
| completed_at | timestamp | nullable |
| sort_order | int | default 0 |
| created_at | timestamp | |
| updated_at | timestamp | |

### daily_focuses (Phase 1)
| Column | Type | Notes |
|--------|------|-------|
| id | bigint PK | |
| user_id | bigint FK | |
| task_id | bigint FK | |
| focus_date | date | |
| sort_order | int | 1-3, Rule of 3 |
| note | text | nullable, quick context |
| created_at | timestamp | |
| updated_at | timestamp | |
| **unique** | | (user_id, task_id, focus_date) |
| **constraint** | | max 3 per user per day |

### ideas (Phase 1)
| Column | Type | Notes |
|--------|------|-------|
| id | bigint PK | |
| user_id | bigint FK | |
| title | varchar(255) | |
| description | text | nullable |
| category | varchar(100) | nullable, free-form tag |
| status | enum | 'inbox', 'converted', 'discarded' |
| converted_to_type | varchar(50) | nullable, 'project' or 'task' |
| converted_to_id | bigint | nullable |
| created_at | timestamp | |
| updated_at | timestamp | |

### weekly_plans (Phase 2)
| Column | Type | Notes |
|--------|------|-------|
| id | bigint PK | |
| user_id | bigint FK | |
| week_start | date | Monday of the week |
| completed_summary | text | nullable, what did I complete |
| blocked_summary | text | nullable, what is blocked |
| next_summary | text | nullable, what is next |
| created_at | timestamp | |
| updated_at | timestamp | |
| **unique** | | (user_id, week_start) |

### project_notes (Phase 2)
| Column | Type | Notes |
|--------|------|-------|
| id | bigint PK | |
| project_id | bigint FK | |
| user_id | bigint FK | |
| title | varchar(255) | |
| content | text | |
| created_at | timestamp | |
| updated_at | timestamp | |

### skill_categories (Phase 3)
| Column | Type | Notes |
|--------|------|-------|
| id | bigint PK | |
| user_id | bigint FK | |
| name | varchar(255) | e.g. 'Engineering', 'Business' |
| sort_order | int | default 0 |
| created_at | timestamp | |
| updated_at | timestamp | |

### skills (Phase 3)
| Column | Type | Notes |
|--------|------|-------|
| id | bigint PK | |
| user_id | bigint FK | |
| category_id | bigint FK | |
| name | varchar(255) | e.g. 'System Design' |
| current_level | enum | 'beginner', 'intermediate', 'advanced', 'expert' |
| target_level | enum | 'beginner', 'intermediate', 'advanced', 'expert' |
| notes | text | nullable |
| created_at | timestamp | |
| updated_at | timestamp | |

### learning_tasks (Phase 3)
| Column | Type | Notes |
|--------|------|-------|
| id | bigint PK | |
| skill_id | bigint FK | |
| user_id | bigint FK | |
| title | varchar(255) | |
| description | text | nullable |
| status | enum | 'todo', 'in_progress', 'done' |
| resource_url | varchar(500) | nullable |
| completed_at | timestamp | nullable |
| created_at | timestamp | |
| updated_at | timestamp | |

### project_skill (Phase 3)
| Column | Type | Notes |
|--------|------|-------|
| id | bigint PK | |
| project_id | bigint FK | |
| skill_id | bigint FK | |
| **unique** | | (project_id, skill_id) |

### reflections (Phase 3)
| Column | Type | Notes |
|--------|------|-------|
| id | bigint PK | |
| user_id | bigint FK | |
| type | enum | 'weekly', 'monthly' |
| period_start | date | |
| period_end | date | |
| went_well | text | nullable |
| went_wrong | text | nullable |
| to_improve | text | nullable |
| projects_progress | text | nullable, monthly only |
| skills_improved | text | nullable, monthly only |
| mistakes | text | nullable, monthly only |
| opportunities | text | nullable, monthly only |
| created_at | timestamp | |
| updated_at | timestamp | |
| **unique** | | (user_id, type, period_start) |

### agent_conversations (Phase 4 - laravel/ai SDK)
| Column | Type | Notes |
|--------|------|-------|
| id | bigint PK | |
| ... | ... | Managed by laravel/ai SDK |

## Indexes
- projects: (user_id, status), (user_id, type)
- tasks: (user_id, status), (project_id, status), (due_date), (user_id, due_date)
- daily_focuses: (user_id, focus_date)
- ideas: (user_id, status)
- milestones: (project_id, status)
- weekly_plans: (user_id, week_start)
- reflections: (user_id, type, period_start)
- skills: (user_id, category_id)
- learning_tasks: (skill_id, status)
