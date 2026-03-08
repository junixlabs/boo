<?php

namespace App\Console\Commands;

use App\Services\PushNotificationService;
use Illuminate\Console\Command;

class SendScheduledPushNotifications extends Command
{
    protected $signature = 'push:send';

    protected $description = 'Send push notifications for top priority nudge';

    public function handle(PushNotificationService $service): int
    {
        $sent = $service->sendScheduledNotifications();

        $this->info($sent ? 'Push notification sent.' : 'No notification to send.');

        return self::SUCCESS;
    }
}
