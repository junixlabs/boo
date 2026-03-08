<?php

namespace App\Enums;

enum IdeaStatus: string
{
    case Inbox = 'inbox';
    case Converted = 'converted';
    case Discarded = 'discarded';
}
