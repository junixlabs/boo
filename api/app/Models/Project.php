<?php

namespace App\Models;

use App\Enums\ProjectStatus;
use App\Enums\ProjectType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Project extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'type',
        'status',
        'vision',
        'priority',
        'repo_url',
        'start_date',
        'target_date',
    ];

    protected $attributes = [
        'status' => 'active',
        'priority' => 3,
    ];

    protected $casts = [
        'type' => ProjectType::class,
        'status' => ProjectStatus::class,
        'priority' => 'integer',
        'start_date' => 'date',
        'target_date' => 'date',
    ];

    public function scopeFilterByStatus($query, ?string $status)
    {
        return $query->when($status, fn($q) => $q->where('status', $status));
    }

    public function scopeFilterByType($query, ?string $type)
    {
        return $query->when($type, fn($q) => $q->where('type', $type));
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }

    public function milestones()
    {
        return $this->hasMany(Milestone::class);
    }

    public function notes()
    {
        return $this->hasMany(ProjectNote::class);
    }

    public function skills()
    {
        return $this->belongsToMany(Skill::class, 'project_skill');
    }
}
