<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NotificationSetting extends Model
{
    protected $attributes = [
        'push_enabled' => true,
        'morning_time' => '08:00',
        'evening_time' => '18:00',
    ];

    protected $fillable = [
        'push_enabled',
        'morning_time',
        'evening_time',
    ];

    protected $casts = [
        'push_enabled' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
