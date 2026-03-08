<?php

namespace App\Models;

use App\Enums\MilestoneStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Milestone extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'title',
        'description',
        'status',
        'target_date',
        'completed_at',
        'sort_order',
    ];

    protected $attributes = [
        'status' => 'pending',
        'sort_order' => 0,
    ];

    protected $casts = [
        'status' => MilestoneStatus::class,
        'target_date' => 'date',
        'completed_at' => 'datetime',
    ];

    public function scopeFilterByStatus($query, ?string $status)
    {
        return $query->when($status, fn($q) => $q->where('status', $status));
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }
}
