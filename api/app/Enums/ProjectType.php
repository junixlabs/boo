<?php

namespace App\Enums;

enum ProjectType: string
{
    case Company = 'company';
    case PersonalStartup = 'personal_startup';
    case Experiment = 'experiment';
    case Learning = 'learning';
}
