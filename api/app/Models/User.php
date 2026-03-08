<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use NotificationChannels\WebPush\HasPushSubscriptions;
use PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory, HasPushSubscriptions, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'timezone',
        'preferred_language',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function getJWTIdentifier(): mixed
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims(): array
    {
        return [];
    }

    public function projects()
    {
        return $this->hasMany(Project::class);
    }

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }

    public function dailyFocuses()
    {
        return $this->hasMany(DailyFocus::class);
    }

    public function ideas()
    {
        return $this->hasMany(Idea::class);
    }

    public function goals()
    {
        return $this->hasMany(Goal::class);
    }

    public function focusAreas()
    {
        return $this->hasMany(FocusArea::class);
    }

    public function lifeDirection()
    {
        return $this->hasOne(LifeDirection::class);
    }

    public function weeklyPlans()
    {
        return $this->hasMany(WeeklyPlan::class);
    }

    public function skillCategories()
    {
        return $this->hasMany(SkillCategory::class);
    }

    public function skills()
    {
        return $this->hasMany(Skill::class);
    }

    public function reflections()
    {
        return $this->hasMany(Reflection::class);
    }

    public function notificationSetting()
    {
        return $this->hasOne(NotificationSetting::class);
    }
}
