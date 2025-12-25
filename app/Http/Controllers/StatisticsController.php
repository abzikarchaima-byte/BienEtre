<?php

namespace App\Http\Controllers;

use App\Models\Mood;
use App\Models\Habit;
use App\Models\HabitLog;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class StatisticsController extends Controller
{
    public function index()
    {
        $userId = auth()->id();
        $now = now();

        // Mood chart data (last 30 days)
        $moodData = Mood::where('user_id', $userId)
            ->where('date', '>=', $now->copy()->subDays(30))
            ->orderBy('date', 'asc')
            ->get()
            ->map(fn($mood) => [
                'date' => $mood->date->format('Y-m-d'),
                'mood_level' => $mood->mood_level,
            ]);

        // Habit statistics
        $habits = Habit::where('user_id', $userId)
            ->where('is_active', true)
            ->withCount([
                'logs as completed_count' => function ($query) use ($now) {
                    $query->where('completed', true)
                        ->where('date', '>=', $now->copy()->subDays(30));
                }
            ])
            ->get()
            ->map(fn($habit) => [
                'name' => $habit->name,
                'category' => $habit->category,
                'completion_rate' => round(($habit->completed_count / 30) * 100, 1),
                'completed_days' => $habit->completed_count,
            ]);

        // Monthly summary
        $startOfMonth = $now->copy()->startOfMonth();
        $totalMoods = Mood::where('user_id', $userId)
            ->where('date', '>=', $startOfMonth)
            ->count();

        $averageMood = Mood::where('user_id', $userId)
            ->where('date', '>=', $startOfMonth)
            ->avg('mood_level');

        $totalJournalEntries = DB::table('journal_entries')
            ->where('user_id', $userId)
            ->whereMonth('created_at', $now->month)
            ->whereYear('created_at', $now->year)
            ->count();

        $totalHabitsCompleted = HabitLog::where('user_id', $userId)
            ->where('completed', true)
            ->where('date', '>=', $startOfMonth)
            ->count();

        return Inertia::render('statistics/index', [
            'moodChart' => $moodData,
            'habitStats' => $habits,
            'summary' => [
                'total_moods' => $totalMoods,
                'average_mood' => round($averageMood ?? 0, 1),
                'total_journal_entries' => $totalJournalEntries,
                'total_habits_completed' => $totalHabitsCompleted,
            ],
        ]);
    }
}
