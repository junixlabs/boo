<?php

use App\Http\Controllers\Api\V1\AiController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\NotificationSettingController;
use App\Http\Controllers\Api\V1\NudgeController;
use App\Http\Controllers\Api\V1\PushSubscriptionController;
use App\Http\Controllers\Api\V1\DailyFocusController;
use App\Http\Controllers\Api\V1\DashboardController;
use App\Http\Controllers\Api\V1\FocusAreaController;
use App\Http\Controllers\Api\V1\GitHubController;
use App\Http\Controllers\Api\V1\GoalController;
use App\Http\Controllers\Api\V1\IdeaController;
use App\Http\Controllers\Api\V1\LearningTaskController;
use App\Http\Controllers\Api\V1\LifeDirectionController;
use App\Http\Controllers\Api\V1\MilestoneController;
use App\Http\Controllers\Api\V1\ProjectController;
use App\Http\Controllers\Api\V1\ProjectNoteController;
use App\Http\Controllers\Api\V1\ReflectionController;
use App\Http\Controllers\Api\V1\SkillCategoryController;
use App\Http\Controllers\Api\V1\SkillController;
use App\Http\Controllers\Api\V1\TaskController;
use App\Http\Controllers\Api\V1\WeeklyPlanController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // Public
    Route::post('auth/register', [AuthController::class, 'register']);
    Route::post('auth/login', [AuthController::class, 'login']);
    Route::get('timezones', fn () => response()->json(DateTimeZone::listIdentifiers()));

    // Auth (protected)
    Route::middleware('auth:api')->group(function () {
        // Auth
        Route::post('auth/logout', [AuthController::class, 'logout']);
        Route::post('auth/refresh', [AuthController::class, 'refresh']);
        Route::get('auth/me', [AuthController::class, 'me']);
        Route::put('auth/profile', [AuthController::class, 'updateProfile']);

        // Dashboard
        Route::get('dashboard/today', [DashboardController::class, 'today']);
        Route::get('dashboard/overview', [DashboardController::class, 'overview']);

        // Projects
        Route::apiResource('projects', ProjectController::class);
        Route::patch('projects/{project}/status', [ProjectController::class, 'updateStatus']);

        // Tasks
        Route::apiResource('tasks', TaskController::class);
        Route::patch('tasks/{task}/status', [TaskController::class, 'updateStatus']);

        // Daily Focus
        Route::get('daily-focus', [DailyFocusController::class, 'index']);
        Route::get('daily-focus/suggestions', [DailyFocusController::class, 'suggestions']);
        Route::post('daily-focus', [DailyFocusController::class, 'store']);
        Route::put('daily-focus/{dailyFocus}', [DailyFocusController::class, 'update']);
        Route::delete('daily-focus/{dailyFocus}', [DailyFocusController::class, 'destroy']);
        Route::post('daily-focus/reorder', [DailyFocusController::class, 'reorder']);

        // Ideas
        Route::apiResource('ideas', IdeaController::class)->except(['show']);
        Route::post('ideas/{idea}/convert', [IdeaController::class, 'convert']);
        Route::patch('ideas/{idea}/discard', [IdeaController::class, 'discard']);

        // Life Direction
        Route::get('life-direction', [LifeDirectionController::class, 'show']);
        Route::put('life-direction/vision', [LifeDirectionController::class, 'updateVision']);

        // Goals
        Route::apiResource('goals', GoalController::class)->except(['show']);

        // Focus Areas
        Route::apiResource('focus-areas', FocusAreaController::class)->except(['show']);

        // Milestones (nested under projects)
        Route::get('projects/{project}/milestones', [MilestoneController::class, 'index']);
        Route::post('projects/{project}/milestones', [MilestoneController::class, 'store']);
        Route::put('milestones/{milestone}', [MilestoneController::class, 'update']);
        Route::patch('milestones/{milestone}/status', [MilestoneController::class, 'updateStatus']);
        Route::delete('milestones/{milestone}', [MilestoneController::class, 'destroy']);

        // Project Notes (nested under projects)
        Route::get('projects/{project}/notes', [ProjectNoteController::class, 'index']);
        Route::post('projects/{project}/notes', [ProjectNoteController::class, 'store']);
        Route::put('notes/{projectNote}', [ProjectNoteController::class, 'update']);
        Route::delete('notes/{projectNote}', [ProjectNoteController::class, 'destroy']);

        // Weekly Plans
        Route::get('weekly-plans', [WeeklyPlanController::class, 'index']);
        Route::post('weekly-plans', [WeeklyPlanController::class, 'store']);
        Route::put('weekly-plans/{weeklyPlan}', [WeeklyPlanController::class, 'update']);

        // Skill Categories
        Route::apiResource('skill-categories', SkillCategoryController::class)->except(['show']);

        // Skills
        Route::apiResource('skills', SkillController::class)->except(['show']);
        Route::post('skills/{skill}/projects', [SkillController::class, 'syncProjects']);

        // Learning Tasks (nested under skills)
        Route::get('skills/{skill}/learning-tasks', [LearningTaskController::class, 'index']);
        Route::post('skills/{skill}/learning-tasks', [LearningTaskController::class, 'store']);
        Route::put('learning-tasks/{learningTask}', [LearningTaskController::class, 'update']);
        Route::patch('learning-tasks/{learningTask}/status', [LearningTaskController::class, 'updateStatus']);
        Route::delete('learning-tasks/{learningTask}', [LearningTaskController::class, 'destroy']);

        // Reflections
        Route::apiResource('reflections', ReflectionController::class)->except(['show']);

        // GitHub
        Route::get('projects/{project}/commits', [GitHubController::class, 'commits']);

        // AI (throttled - calls Gemini)
        Route::middleware('throttle:ai')->group(function () {
            Route::post('ai/weekly-summary', [AiController::class, 'weeklySummary']);
            Route::post('ai/suggest-priorities', [AiController::class, 'suggestPriorities']);
            Route::post('ai/review-prompt', [AiController::class, 'reviewPrompt']);
            Route::post('ai/chat', [AiController::class, 'chat']);
        });

        // AI (no throttle - DB only)
        Route::get('ai/chat/history', [AiController::class, 'chatHistory']);
        Route::delete('ai/chat/{conversationId}', [AiController::class, 'clearChat']);
        Route::get('ai/daily-briefing', [AiController::class, 'dailyBriefing']);

        // Nudges
        Route::get('ai/nudges', [NudgeController::class, 'index']);
        Route::post('ai/nudges/dismiss', [NudgeController::class, 'dismiss']);

        // Push Subscriptions
        Route::get('push-subscriptions/key', [PushSubscriptionController::class, 'key']);
        Route::post('push-subscriptions', [PushSubscriptionController::class, 'store']);
        Route::delete('push-subscriptions', [PushSubscriptionController::class, 'destroy']);

        // Notification Settings
        Route::get('notification-settings', [NotificationSettingController::class, 'show']);
        Route::put('notification-settings', [NotificationSettingController::class, 'update']);
    });
});
