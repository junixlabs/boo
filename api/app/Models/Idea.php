<?php

namespace App\Models;

use App\Enums\IdeaStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Idea extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'category',
        'status',
        'converted_to_type',
        'converted_to_id',
    ];

    protected $attributes = [
        'status' => 'inbox',
    ];

    protected $casts = [
        'status' => IdeaStatus::class,
    ];

    public function scopeFilterByStatus($query, ?string $status)
    {
        return $query->when($status, fn($q) => $q->where('status', $status));
    }

    public function scopeFilterByCategory($query, ?string $category)
    {
        return $query->when($category, fn($q) => $q->where('category', $category));
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
