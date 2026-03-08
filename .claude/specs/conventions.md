# LifeStack API - Development Conventions

Rules and patterns to follow when developing new modules. Every new endpoint MUST follow these patterns.

## Request Flow

```
Route -> FormRequest (validation) -> Controller (thin) -> Service (logic) -> Model -> Resource (response)
         Policy (authorization)
```

- Controllers: NO business logic. Delegate everything to Services.
- Services: ALL business logic lives here. One service per model.
- FormRequest: ALL validation rules. One per action (Store, Update, UpdateStatus, etc.).
- Resource: ALL response shaping. Enum values use `->value`, dates use `->toIso8601String()` or `->toDateString()`.
- Policy: ALL authorization. Check `$user->id === $model->user_id`.

## File Naming

| Layer | Pattern | Example |
|-------|---------|---------|
| Controller | `{Model}Controller.php` | `ProjectController.php` |
| Store Request | `Store{Model}Request.php` | `StoreProjectRequest.php` |
| Update Request | `Update{Model}Request.php` | `UpdateProjectRequest.php` |
| Status Request | `Update{Model}StatusRequest.php` | `UpdateProjectStatusRequest.php` |
| Resource | `{Model}Resource.php` | `ProjectResource.php` |
| Service | `{Model}Service.php` | `ProjectService.php` |
| Policy | `{Model}Policy.php` | `ProjectPolicy.php` |
| Enum | `{Model}{Field}.php` | `ProjectStatus.php`, `TaskPriority.php` |

## Namespace

```
App\Ai\Agents\                    (Phase 4: AI agents)
App\Http\Controllers\Api\V1\
App\Http\Requests\
App\Http\Resources\
App\Services\
App\Models\
App\Policies\
App\Enums\
App\Traits\
```

## Controller Pattern

```php
class ExampleController extends Controller
{
    use ApiResponse;

    // Inject service via constructor promotion
    public function __construct(private ExampleService $exampleService) {}

    // List: use $request->all() for filters, return Resource::collection
    public function index(Request $request): JsonResponse
    {
        $items = $this->exampleService->list($request->user(), $request->all());
        return ExampleResource::collection($items)->response();
    }

    // Create: use StoreRequest, return $this->created()
    public function store(StoreExampleRequest $request): JsonResponse
    {
        $item = $this->exampleService->create($request->user(), $request->validated());
        return $this->created(new ExampleResource($item));
    }

    // Show: authorize first, return $this->success()
    public function show(Request $request, Example $example): JsonResponse
    {
        $this->authorize('view', $example);
        $example = $this->exampleService->show($example);
        return $this->success(new ExampleResource($example));
    }

    // Update: authorize first, use UpdateRequest
    public function update(UpdateExampleRequest $request, Example $example): JsonResponse
    {
        $this->authorize('update', $example);
        $example = $this->exampleService->update($example, $request->validated());
        return $this->success(new ExampleResource($example));
    }

    // Delete: authorize first, return $this->noContent()
    public function destroy(Request $request, Example $example): JsonResponse
    {
        $this->authorize('delete', $example);
        $this->exampleService->delete($example);
        return $this->noContent();
    }
}
```

## Service Pattern

```php
class ExampleService
{
    // List: always scope by user, apply filter scopes, paginate
    public function list(User $user, array $filters): LengthAwarePaginator
    {
        return $user->examples()
            ->filterByStatus($filters['status'] ?? null)
            ->orderBy($filters['sort'] ?? 'created_at', $filters['order'] ?? 'desc')
            ->paginate($filters['per_page'] ?? 20);
    }

    // Create: use relationship create, return ->fresh() for enum cast
    public function create(User $user, array $data): Example
    {
        return $user->examples()->create($data)->fresh();
    }

    // Update: update then return ->fresh() for enum cast
    public function update(Example $example, array $data): Example
    {
        $example->update($data);
        return $example->fresh();
    }

    public function delete(Example $example): void
    {
        $example->delete();
    }
}
```

Key rules:
- `->fresh()` after create/update: required when model has enum casts, otherwise the returned model has raw string values instead of enum instances.
- Scope by user: always access models through `$user->examples()` in create/list. Never query without user scoping.

## Model Pattern

```php
class Example extends Model
{
    use HasFactory;      // Add SoftDeletes if needed

    // Explicit table name if Laravel pluralizes incorrectly
    // protected $table = 'daily_focuses';  // Laravel would guess "foci"

    protected $fillable = [/* mass-assignable fields, include user_id */];

    // Default attribute values for enum fields
    protected $attributes = [
        'status' => 'active',
    ];

    // Cast enums and dates
    protected $casts = [
        'status' => ExampleStatus::class,
        'some_date' => 'date',
    ];

    // Filter scopes: scopeFilterBy{Field}
    public function scopeFilterByStatus($query, ?string $status)
    {
        return $query->when($status, fn($q) => $q->where('status', $status));
    }

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
```

Key rules:
- `$attributes` defaults: required for enum-cast fields, otherwise Laravel can't instantiate the model without explicit values.
- Custom `$table`: set manually when Laravel's pluralization is wrong (e.g., `daily_focuses` not `daily_foci`).
- Filter scopes: use `scopeFilterBy{Field}` naming convention, accept nullable, use `when()`.

## Enum Pattern

```php
enum ExampleStatus: string
{
    case Active = 'active';
    case Completed = 'completed';
}
```

- Always backed by `string`.
- Case names: PascalCase. Values: snake_case.
- Use in FormRequest: `Rule::enum(ExampleStatus::class)`.
- Use in Resource: `$this->status->value`.

## FormRequest Pattern

```php
class StoreExampleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;  // Authorization handled by Policy in controller
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'status' => ['sometimes', Rule::enum(ExampleStatus::class)],
            'related_id' => ['nullable', 'exists:related_table,id'],
        ];
    }
}
```

- `authorize()` always returns `true` — authorization is handled by Policies in the controller.
- Use array syntax for rules, not pipe-separated strings.

## Resource Pattern

```php
class ExampleResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'status' => $this->status->value,              // enum ->value
            'due_date' => $this->due_date?->toDateString(), // date nullable
            'created_at' => $this->created_at->toIso8601String(),
            'updated_at' => $this->updated_at->toIso8601String(),
            // Conditional counts
            'tasks_count' => $this->whenCounted('tasks'),
        ];
    }
}
```

## Policy Pattern

```php
class ExamplePolicy
{
    public function view(User $user, Example $example): bool
    {
        return $user->id === $example->user_id;
    }

    public function update(User $user, Example $example): bool
    {
        return $user->id === $example->user_id;
    }

    public function delete(User $user, Example $example): bool
    {
        return $user->id === $example->user_id;
    }
}
```

- Single user app: all policies check `$user->id === $model->user_id`.
- No `create` policy needed — user creates their own resources.

## ApiResponse Trait

```php
$this->success($data, 200);   // Wraps in { "data": ... }
$this->created($data);        // 201
$this->noContent();            // 204, null body
```

## Route Pattern

```php
Route::prefix('v1')->group(function () {
    // Public routes (no auth)
    Route::post('auth/register', [AuthController::class, 'register']);
    Route::post('auth/login', [AuthController::class, 'login']);

    // Protected routes
    Route::middleware('auth:api')->group(function () {
        // Use apiResource for standard CRUD
        Route::apiResource('examples', ExampleController::class);
        // Custom actions as separate routes
        Route::patch('examples/{example}/status', [ExampleController::class, 'updateStatus']);
    });
});
```

## Error Handling

Global error handling in `bootstrap/app.php`:
- `NotFoundHttpException` -> 404 JSON
- `AccessDeniedHttpException` -> 403 JSON
- `AuthenticationException` -> 401 JSON

Do NOT use `abort_if()` or `abort()` in controllers. Use Policy authorization via `$this->authorize()`.

## Migration Pattern

Naming: `YYYY_MM_DD_HHMMSS_create_{table}_table.php`

Always include:
- `$table->foreignId('user_id')->constrained()->cascadeOnDelete();` for user-owned tables
- `$table->timestamps();`
- `$table->softDeletes();` only when needed (currently: projects)
- Relevant indexes for query performance

## Adding a New Module Checklist

1. Create Enum(s) in `app/Enums/`
2. Create Migration in `database/migrations/`
3. Create Model in `app/Models/` (with fillable, casts, attributes, scopes, relationships)
4. Create Policy in `app/Policies/`
5. Create FormRequest(s) in `app/Http/Requests/`
6. Create Service in `app/Services/`
7. Create Resource in `app/Http/Resources/`
8. Create Controller in `app/Http/Controllers/Api/V1/` (use ApiResponse trait)
9. Add routes in `routes/api.php`
10. Run `php artisan migrate`
11. Verify Scramble docs at `/docs/api`

## AI Agent Pattern (Phase 4)

```php
#[Provider(Lab::Gemini)]
#[Model('gemini-2.0-flash')]
class ExampleAgent implements Agent, HasStructuredOutput
{
    use Promptable;

    public function instructions(): Stringable|string { return '...'; }

    public function schema(JsonSchema $schema): array
    {
        return [
            'field' => $schema->string()->required(),
            'list' => $schema->array()->items($schema->string())->required(),
            'objects' => $schema->array()->items($schema->object([
                'id' => $schema->integer()->required(),
                'reason' => $schema->string()->required(),
            ]))->required(),
        ];
    }
}
```

Key rules:
- Array schema: use `$schema->array()->items(...)`, NOT `$schema->array($type)`
- PostgreSQL: cannot use `having` on `withCount` aliases — filter in PHP with `->filter()` instead
- Enum fields in prompts: use `->value` (e.g., `$task->priority->value`)
