<?php

namespace App\Enums;

enum LearningTaskStatus: string
{
    case Todo = 'todo';
    case InProgress = 'in_progress';
    case Done = 'done';
}
