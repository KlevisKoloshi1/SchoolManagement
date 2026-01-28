<?php

namespace App\Enums;

enum UserRole: string
{
    case Admin = 'admin';
    case MainTeacher = 'main_teacher';
    case Teacher = 'teacher';
    case Student = 'student';
    case Parent = 'parent';
}

