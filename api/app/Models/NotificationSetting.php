<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NotificationSetting extends Model
{
    protected $attributes = [
        'push_enabled' => true,
        'morning_time' => '08:00',
        'evening_time' => '18:00',
        'gentle_mode' => false,
        'quiet_hours_start' => '22:00',
        'quiet_hours_end' => '08:00',
        'weekend_mode' => true,
    ];

    protected $fillable = [
        'push_enabled',
        'morning_time',
        'evening_time',
        'gentle_mode',
        'quiet_hours_start',
        'quiet_hours_end',
        'weekend_mode',
    ];

    protected $casts = [
        'push_enabled' => 'boolean',
        'gentle_mode' => 'boolean',
        'weekend_mode' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
