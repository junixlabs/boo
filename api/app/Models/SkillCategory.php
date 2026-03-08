<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SkillCategory extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'sort_order',
    ];

    protected $attributes = [
        'sort_order' => 0,
    ];

    protected $casts = [
        'sort_order' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function skills()
    {
        return $this->hasMany(Skill::class, 'category_id');
    }
}
