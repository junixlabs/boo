<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DailyFocus extends Model
{
    protected $table = 'daily_focuses';

    protected $fillable = [
        'user_id',
        'task_id',
        'focus_date',
        'sort_order',
        'note',
    ];

    protected $casts = [
        'focus_date' => 'date',
        'sort_order' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function task()
    {
        return $this->belongsTo(Task::class);
    }
}
