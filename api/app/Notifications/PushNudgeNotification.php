<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use NotificationChannels\WebPush\WebPushChannel;
use NotificationChannels\WebPush\WebPushMessage;

class PushNudgeNotification extends Notification
{
    public function __construct(private array $nudge) {}

    public function via($notifiable): array
    {
        return [WebPushChannel::class];
    }

    public function toWebPush($notifiable, $notification): WebPushMessage
    {
        return (new WebPushMessage)
            ->title($this->nudge['title'])
            ->body($this->nudge['message'])
            ->icon('/boo-icon.png')
            ->data([
                'type' => $this->nudge['type'],
                'priority' => $this->nudge['priority'],
                'boo_expression' => $this->nudge['boo_expression'],
                'data' => $this->nudge['data'] ?? null,
            ])
            ->options(['TTL' => 3600]);
    }
}
