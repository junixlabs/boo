<?php

namespace App\Models;

use App\Enums\TaskPriority;
use App\Enums\TaskStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'project_id',
        'milestone_id',
        'title',
        'description',
        'expected_outcome',
        'status',
        'priority',
        'due_date',
        'completed_at',
        'sort_order',
    ];

    protected $attributes = [
        'status' => 'todo',
        'priority' => 'medium',
        'sort_order' => 0,
    ];

    protected $casts = [
        'status' => TaskStatus::class,
        'priority' => TaskPriority::class,
        'due_date' => 'date',
        'completed_at' => 'datetime',
        'sort_order' => 'integer',
    ];

    public function scopeFilterByProject($query, ?int $projectId)
    {
        return $query->when($projectId, fn($q) => $q->where('project_id', $projectId));
    }

    public function scopeFilterByStatus($query, ?string $status)
    {
        return $query->when($status, fn($q) => $q->whereIn('status', explode(',', $status)));
    }

    public function scopeFilterByPriority($query, ?string $priority)
    {
        return $query->when($priority, fn($q) => $q->where('priority', $priority));
    }

    public function scopeDueBetween($query, ?string $from, ?string $to)
    {
        return $query->when($from, fn($q) => $q->where('due_date', '>=', $from))
                     ->when($to, fn($q) => $q->where('due_date', '<=', $to));
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function milestone()
    {
        return $this->belongsTo(Milestone::class);
    }

    public function dailyFocuses()
    {
        return $this->hasMany(DailyFocus::class);
    }
}
