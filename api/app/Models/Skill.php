<?php

namespace App\Models;

use App\Enums\SkillLevel;
use Illuminate\Database\Eloquent\Model;

class Skill extends Model
{
    protected $fillable = [
        'user_id',
        'category_id',
        'name',
        'current_level',
        'target_level',
        'notes',
    ];

    protected $attributes = [
        'current_level' => 'beginner',
        'target_level' => 'advanced',
    ];

    protected $casts = [
        'current_level' => SkillLevel::class,
        'target_level' => SkillLevel::class,
    ];

    public function scopeFilterByCategory($query, ?int $categoryId)
    {
        return $query->when($categoryId, fn($q) => $q->where('category_id', $categoryId));
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function category()
    {
        return $this->belongsTo(SkillCategory::class, 'category_id');
    }

    public function learningTasks()
    {
        return $this->hasMany(LearningTask::class);
    }

    public function projects()
    {
        return $this->belongsToMany(Project::class, 'project_skill');
    }
}
