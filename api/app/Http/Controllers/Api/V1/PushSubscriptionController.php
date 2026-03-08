<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePushSubscriptionRequest;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PushSubscriptionController extends Controller
{
    use ApiResponse;

    public function key(): JsonResponse
    {
        return $this->success([
            'public_key' => config('webpush.vapid.public_key'),
        ]);
    }

    public function store(StorePushSubscriptionRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $request->user()->updatePushSubscription(
            $validated['endpoint'],
            $validated['keys']['p256dh'],
            $validated['keys']['auth'],
            $validated['content_encoding'] ?? 'aesgcm'
        );

        return $this->created(['subscribed' => true]);
    }

    public function destroy(Request $request): JsonResponse
    {
        $request->validate(['endpoint' => ['required', 'url']]);

        $request->user()->deletePushSubscription($request->endpoint);

        return $this->success(['unsubscribed' => true]);
    }
}
