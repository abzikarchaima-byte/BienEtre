<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Habit;
use App\Models\Mood;
use App\Models\HabitLog;

class DashboardController extends Controller
{
    public function index()
    {
        $userId = auth()->id();

        return Inertia::render('dashboard', [
            'habits' => Habit::where('user_id', $userId)
                ->where('is_active', true)
                ->orderBy('created_at', 'desc')
                ->get(),

            'todayMood' => Mood::where('user_id', $userId)
                ->whereDate('created_at', today())
                ->first(),

            'habitLogs' => HabitLog::where('user_id', $userId)
                ->whereDate('date', today())
                ->get()
                ->keyBy('habit_id'),
        ]);
    }
}
