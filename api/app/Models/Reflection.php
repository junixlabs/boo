<?php

namespace App\Models;

use App\Enums\ReflectionType;
use Illuminate\Database\Eloquent\Model;

class Reflection extends Model
{
    protected $fillable = [
        'user_id',
        'type',
        'period_start',
        'period_end',
        'went_well',
        'went_wrong',
        'to_improve',
        'projects_progress',
        'skills_improved',
        'mistakes',
        'opportunities',
    ];

    protected $casts = [
        'type' => ReflectionType::class,
        'period_start' => 'date',
        'period_end' => 'date',
    ];

    public function scopeFilterByType($query, ?string $type)
    {
        return $query->when($type, fn($q) => $q->where('type', $type));
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
