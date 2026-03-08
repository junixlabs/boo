<?php

namespace App\Models;

use App\Enums\GoalStatus;
use App\Enums\GoalTimeframe;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Goal extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'timeframe',
        'status',
        'progress',
        'target_date',
        'sort_order',
    ];

    protected $attributes = [
        'status' => 'active',
        'sort_order' => 0,
    ];

    protected $casts = [
        'timeframe' => GoalTimeframe::class,
        'status' => GoalStatus::class,
        'target_date' => 'date',
        'progress' => 'integer',
    ];

    public function scopeFilterByTimeframe($query, ?string $timeframe)
    {
        return $query->when($timeframe, fn($q) => $q->where('timeframe', $timeframe));
    }

    public function scopeFilterByStatus($query, ?string $status)
    {
        return $query->when($status, fn($q) => $q->where('status', $status));
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
