# LifeStack - Personal Operating System (POS)

## Project Vision
A Personal Operating System that answers 5 questions every day:
1. What projects am I building?
2. Which project is the real priority?
3. What do I need to do today to move closer to my goals?
4. What skills am I improving?
5. Am I wasting time on unimportant things?

## Design Constraints
- Daily update: < 5 minutes
- Weekly review: < 30 minutes
- Single user (personal tool)
- Must not become a burden

## Architecture

```
[React SPA + Shadcn UI]  <-->  [Laravel API]  <-->  [PostgreSQL]
                                     |
                                 [Gemini AI]
```

### Backend: Laravel API
- RESTful API with full OpenAPI documentation
- JWT authentication (`php-open-source-saver/jwt-auth`)
- JSON responses, standard HTTP status codes
- Database: PostgreSQL (leverage JSONB for flexible metadata)

### Frontend: React SPA + Shadcn UI
- Vite + React + TypeScript
- Shadcn UI component library
- TanStack Query for API state management
- React Router for navigation
- Integrates from API documentation

### AI: Gemini API (via laravel/ai SDK)
- Weekly review summary generation (WeeklySummaryAgent)
- Priority suggestions based on project/task data (SuggestPrioritiesAgent)
- Reflection prompt generation (ReviewPromptAgent)
- All agents use `#[Provider(Lab::Gemini)]`, `#[Model('gemini-2.0-flash')]`, `HasStructuredOutput`
- Rate limited: 10 requests/hour per user (throttle:ai middleware)

## Module Architecture

```
Personal OS
|
+-- Life Direction    (Vision, Goals, Focus Areas)
+-- Projects          (Company, Startup, Experiment, Learning)
+-- Execution         (Daily Dashboard, Weekly Planning, Rule of 3)
+-- Skill Development (Skill Map, Learning Tasks, Progress)
+-- Reflection        (Weekly Review, Monthly Review)
```

## Implementation Phases

| Phase | Scope | Priority |
|-------|-------|----------|
| Phase 1 - MVP | Auth + Projects + Tasks + Daily Focus + Idea Inbox | HIGH |
| Phase 2 - Planning | Life Direction + Milestones + Weekly Planning + Notes | HIGH |
| Phase 3 - Growth | Skill Development + Weekly/Monthly Reviews | MEDIUM |
| Phase 4 - Intelligence | Gemini AI + Git Integration + Project Health | LOW |

## API Conventions
- Base URL: `/api/v1`
- Auth: JWT Bearer token (`php-open-source-saver/jwt-auth`)
- Pagination: `?page=1&per_page=20`
- Sorting: `?sort=field&order=asc|desc`
- Filtering: `?filter[field]=value`
- Response envelope: `{ "data": ..., "meta": ... }`
- Errors: `{ "message": "...", "errors": { "field": ["..."] } }`
- Timestamps: ISO 8601 format
- Soft deletes where appropriate
