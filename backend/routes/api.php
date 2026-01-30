<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Admin\AdminTeacherController;
use App\Http\Controllers\Admin\AssignmentController;
use App\Http\Controllers\MainTeacher\MainTeacherAbsenceController;
use App\Http\Controllers\MainTeacher\MainTeacherGradeController;
use App\Http\Controllers\MainTeacher\MainTeacherLessonTopicController;
use App\Http\Controllers\MainTeacher\MainTeacherStudentController;
use App\Http\Controllers\Student\StudentAbsenceController;
use App\Http\Controllers\Student\StudentGradeController;
use App\Http\Controllers\Teacher\TeacherAbsenceController;
use App\Http\Controllers\Teacher\TeacherGradeController;
use App\Http\Controllers\Teacher\TeacherLessonTopicController;
use Illuminate\Support\Facades\Route;

Route::middleware('throttle:api')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);

        Route::prefix('admin')->middleware('role:admin')->group(function () {
            Route::get('/teachers', [AdminTeacherController::class, 'index']);
            Route::post('/teachers', [AdminTeacherController::class, 'store']);
            Route::delete('/teachers/{id}', [AdminTeacherController::class, 'destroy']);
            Route::post('/assign-class', [AssignmentController::class, 'assignClass']);
            Route::post('/assign-subject', [AssignmentController::class, 'assignSubject']);
        });

        Route::prefix('main-teacher')->middleware('role:main_teacher')->group(function () {
            Route::post('/students', [MainTeacherStudentController::class, 'store']);
            Route::post('/lesson-topics', [MainTeacherLessonTopicController::class, 'store']);
            Route::post('/absences', [MainTeacherAbsenceController::class, 'store']);
            Route::post('/grades', [MainTeacherGradeController::class, 'store']);
        });

        Route::prefix('teacher')->middleware('role:teacher')->group(function () {
            Route::post('/lesson-topics', [TeacherLessonTopicController::class, 'store']);
            Route::post('/absences', [TeacherAbsenceController::class, 'store']);
            Route::post('/grades', [TeacherGradeController::class, 'store']);
        });

        Route::prefix('student')->middleware('role:student')->group(function () {
            Route::get('/grades', [StudentGradeController::class, 'index']);
            Route::get('/absences', [StudentAbsenceController::class, 'index']);
        });
    });
});

