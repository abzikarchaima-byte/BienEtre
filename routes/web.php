<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
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
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    
    // Habitudes
    Route::get('habits', function () {
        return Inertia::render('habits/index');
    })->name('habits');
    Route::post('habits', [HabitController::class, 'store']);
    Route::put('habits/{habit}', [HabitController::class, 'update']);
    Route::delete('habits/{habit}', [HabitController::class, 'destroy']);
    
    // Journal
    Route::get('journal', function () {
        return Inertia::render('journal/index');
    })->name('journal.index');
    Route::get('journal/create', function () {
        return Inertia::render('journal/create');
    })->name('journal.create');
    Route::post('journal', [JournalController::class, 'store']);
    Route::delete('journal/{entry}', [JournalController::class, 'destroy']);
    
    // Statistiques
    Route::get('statistics', function () {
        return Inertia::render('statistics/index');
    })->name('statistics');
    
    // Humeur
    Route::post('moods', [MoodController::class, 'store']);
    
    // Toggle habitude
    Route::post('habits/{habit}/toggle', [HabitLogController::class, 'toggle']);
});

require __DIR__.'/settings.php';