<?php

namespace App\Models;

use App\Enums\LearningTaskStatus;
use Illuminate\Database\Eloquent\Model;

class LearningTask extends Model
{
    protected $fillable = [
        'skill_id',
        'user_id',
        'title',
        'description',
        'status',
        'resource_url',
        'completed_at',
    ];

    protected $attributes = [
        'status' => 'todo',
    ];

    protected $casts = [
        'status' => LearningTaskStatus::class,
        'completed_at' => 'datetime',
    ];

    public function scopeFilterByStatus($query, ?string $status)
    {
        return $query->when($status, fn($q) => $q->whereIn('status', explode(',', $status)));
    }

    public function skill()
    {
        return $this->belongsTo(Skill::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
