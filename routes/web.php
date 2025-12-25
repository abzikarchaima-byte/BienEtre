<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HabitController;
use App\Http\Controllers\MoodController;
use App\Http\Controllers\HabitLogController;
use App\Http\Controllers\JournalController;
use App\Http\Controllers\StatisticsController;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Habits
    Route::get('habits', [HabitController::class, 'index'])->name('habits');
    Route::post('habits', [HabitController::class, 'store']);
    Route::put('habits/{habit}', [HabitController::class, 'update']);
    Route::delete('habits/{habit}', [HabitController::class, 'destroy']);
    Route::post('habits/{habit}/toggle', [HabitLogController::class, 'toggle']);

    // Journal
    Route::get('journal', [JournalController::class, 'index'])->name('journal.index');
    Route::get('journal/create', [JournalController::class, 'create'])->name('journal.create');
    Route::post('journal', [JournalController::class, 'store']);
    Route::delete('journal/{entry}', [JournalController::class, 'destroy']);

    // Statistics
    Route::get('statistics', [StatisticsController::class, 'index'])->name('statistics');

    // Mood
    Route::post('moods', [MoodController::class, 'store']);
});

require __DIR__ . '/settings.php';
