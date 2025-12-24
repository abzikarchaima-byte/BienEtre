<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MoodController;
use App\Http\Controllers\HabitController;
use App\Http\Controllers\HabitLogController;
use App\Http\Controllers\JournalController;
use App\Http\Controllers\StatisticsController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// ============================================
// Routes publiques (pas besoin d'authentification)
// ============================================
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// ============================================
// Routes protégées (nécessitent authentification)
// ============================================
Route::middleware('auth:web')->group(function () {


   
    
    // ---------- Authentification ----------
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    
    // ---------- Humeur (Moods) ----------
    Route::get('/moods/today', [MoodController::class, 'today']);        // MUST BE FIRST
    Route::get('/moods', [MoodController::class, 'index']);
    Route::post('/moods', [MoodController::class, 'store']);
    
    // ---------- Habitudes (Habits) ----------
    Route::get('/habits', [HabitController::class, 'index']);
    Route::post('/habits', [HabitController::class, 'store']);
    Route::post('/habits/{habit}/toggle', [HabitLogController::class, 'toggle']); // BEFORE {habit}
    Route::put('/habits/{habit}', [HabitController::class, 'update']);
    Route::delete('/habits/{habit}', [HabitController::class, 'destroy']);
    
    // ---------- Suivi des habitudes (Habit Logs) ----------
    Route::get('/habit-logs/today', [HabitLogController::class, 'today']);
    
    // ---------- Journal ----------
    Route::get('/journal', [JournalController::class, 'index']);
    Route::post('/journal', [JournalController::class, 'store']);
    Route::get('/journal/{entry}', [JournalController::class, 'show']);
    Route::put('/journal/{entry}', [JournalController::class, 'update']);
    Route::delete('/journal/{entry}', [JournalController::class, 'destroy']);
    
    // ---------- Statistiques ----------
    Route::get('/statistics/mood-chart', [StatisticsController::class, 'moodChart']);
    Route::get('/statistics/habits', [StatisticsController::class, 'habitStats']);
    Route::get('/statistics/summary', [StatisticsController::class, 'monthlySummary']);
});