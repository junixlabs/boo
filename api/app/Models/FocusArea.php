<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FocusArea extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'is_active',
        'sort_order',
    ];

    protected $attributes = [
        'is_active' => true,
        'sort_order' => 0,
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function scopeFilterByActive($query, ?bool $isActive)
    {
        return $query->when($isActive !== null, fn($q) => $q->where('is_active', $isActive));
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
