---
name: frontend-builder
description: >
  LifeStack frontend module builder. Guides the standard workflow for building
  React feature modules that integrate with the Laravel API. Use when:
  (1) building a new frontend feature/module from API endpoints,
  (2) adding a new page or CRUD feature to the frontend,
  (3) reviewing or fixing frontend code patterns,
  (4) extending existing modules with new components.
  Triggers on: 'build frontend', 'new module', 'new feature', 'new page',
  'frontend module', 'add frontend for', 'implement frontend'.
---

# LifeStack Frontend Builder

## Project Context

- **Frontend**: `web/` directory - Vite 7 + React 19 + TypeScript
- **UI**: Shadcn UI v4 (`@base-ui/react`, NOT Radix) + Tailwind CSS
- **State**: TanStack Query v5 (server) + Zustand (client/auth)
- **Routing**: React Router v7
- **API**: Axios instance at `src/lib/axios.ts`, baseURL `/api/v1`
- **API Docs**: `http://localhost:8000/docs/api` (Scalar UI)
- **API Spec**: `http://localhost:8000/docs/api.json` (OpenAPI JSON)
- **Dev server**: `cd web && npm run dev` (port 5173, proxy `/api` to 8000)

## Architecture: Feature-Based

```
src/
  features/{module}/
    types.ts              # Models, payloads, filters, enums
    api/{module}.api.ts   # Axios calls (thin, typed)
    hooks/use{Module}.ts  # TanStack Query hooks + query key factory
    components/*.tsx      # UI components (cards, forms, lists, dialogs)
  pages/{Page}Page.tsx    # Thin route compositions
  app/router.tsx          # React Router config
  components/ui/          # Shadcn UI primitives (do not modify)
  components/layout/      # AppShell, Sidebar, Header, ProtectedRoute
  components/common/      # Shared: PageHeader, EmptyState, LoadingSpinner
  types/api.ts            # ApiResponse<T>, PaginatedResponse<T>, ApiError
  lib/axios.ts            # Axios instance with JWT interceptor
  store/auth.store.ts     # Zustand JWT token store
```

## Module Build Workflow

Follow these 8 steps in order for each new module.

### Step 1: Review API Spec

Fetch the OpenAPI spec or read the backend source to understand:
- Available endpoints (CRUD, status changes, special actions)
- Request body fields and validation rules
- Response shape (single vs paginated, nested relations)
- Filter/query parameters

```bash
curl -s http://localhost:8000/docs/api.json | python3 -c "
import json,sys; d=json.load(sys.stdin)
for p in sorted(d['paths']): print(p)
"
```

### Step 2: Define Types (`types.ts`)

Create `src/features/{module}/types.ts`.

- Model interface matches API Resource response exactly
- Payload interface matches FormRequest fields
- Filters interface matches API query parameters
- Enum types use union literals (`type Status = 'active' | 'paused'`)

See [references/patterns.md](references/patterns.md) - "Type Definitions" section.

### Step 3: API Layer (`api/{module}.api.ts`)

Create `src/features/{module}/api/{module}.api.ts`.

- Import `api` from `@/lib/axios`
- Import response types from `@/types/api`
- Each method returns typed axios response
- Use `ApiResponse<T>` for single item, `PaginatedResponse<T>` for lists

See [references/patterns.md](references/patterns.md) - "API Layer" section.

### Step 4: Query Hooks (`hooks/use{Module}.ts`)

Create `src/features/{module}/hooks/use{Module}.ts`.

- Export `{module}Keys` query key factory
- One `useQuery` hook per GET endpoint
- One `useMutation` hook per write operation
- Mutations invalidate own module + cross-module queries when needed
- Cross-module examples: tasks invalidate `projectKeys.all`, status changes invalidate `['dashboard']`

See [references/patterns.md](references/patterns.md) - "Query Hooks" section.

### Step 5: Build Components (`components/*.tsx`)

Common component types:
- **Card**: Display item in a list
- **List**: Render array of cards with empty state
- **Form**: Create/edit dialog form with controlled inputs
- **StatusBadge**: Enum-to-label display with styled badge
- **StatusToggle**: Dropdown to change status

See [references/patterns.md](references/patterns.md) - "Components" and "Known Pitfalls" sections.

### Step 6: Create Page (`pages/{Module}Page.tsx`)

Pages are thin compositions:
- Use hooks from Step 4, compose components from Step 5
- Manage local UI state (dialog open, filters)
- Use `PageHeader` for title + action button
- Use `PageLoading` for loading state

### Step 7: Add Route

1. Edit `src/app/router.tsx` - add route inside `ProtectedRoute > AppShell` children
2. Edit `src/components/layout/Sidebar.tsx` - add navigation link with icon

### Step 8: QA

- Run `npx tsc --noEmit` to verify zero TypeScript errors
- Test in browser: CRUD operations, filters, edge cases
- Verify enum values display as human-readable labels, not raw values

## Known Pitfalls (Quick Reference)

Full details in [references/patterns.md](references/patterns.md) - "Known Pitfalls" section.

1. **Select label bug**: `<SelectValue>` must receive explicit children (label text), not rely on auto-resolution
2. **Enum display**: Never render raw enum values (`in_progress`), always map to labels (`In Progress`)
3. **base-ui vs Radix**: No `asChild` prop. `onValueChange` signature is `(value: string | null, event) => void`
4. **Nested routes**: Modules nested under a parent (e.g., milestones under projects) use URL params, not separate top-level routes
