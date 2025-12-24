<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class StatisticsController extends Controller
{
    public function moodChart(Request $request)
    {
        $days = $request->input('days', 30);
        
        $moods = $request->user()
            ->moods()
            ->where('date', '>=', Carbon::now()->subDays($days))
            ->orderBy('date')
            ->get(['date', 'mood_level']);

        return response()->json($moods);
    }

    public function habitStats(Request $request)
    {
        $habits = $request->user()->habits()->where('is_active', true)->get();
        
        $stats = $habits->map(function ($habit) use ($request) {
            $thisMonth = Carbon::now()->startOfMonth();
            
            $totalLogs = $habit->logs()
                ->where('date', '>=', $thisMonth)
                ->count();
                
            $completedLogs = $habit->logs()
                ->where('date', '>=', $thisMonth)
                ->where('completed', true)
                ->count();
            
            $successRate = $totalLogs > 0 ? round(($completedLogs / $totalLogs) * 100) : 0;
            
            return [
                'habit' => $habit,
                'completed_count' => $completedLogs,
                'total_days' => $totalLogs,
                'success_rate' => $successRate
            ];
        });

        return response()->json($stats);
    }

    public function monthlySummary(Request $request)
    {
        $thisMonth = Carbon::now()->startOfMonth();
        
        // Humeur moyenne
        $avgMood = $request->user()
            ->moods()
            ->where('date', '>=', $thisMonth)
            ->avg('mood_level');
        
        // Total entrées journal
        $journalCount = $request->user()
            ->journalEntries()
            ->where('created_at', '>=', $thisMonth)
            ->count();
        
        // Habitude la plus suivie
        $topHabit = DB::table('habit_logs')
            ->join('habits', 'habit_logs.habit_id', '=', 'habits.id')
            ->where('habit_logs.user_id', $request->user()->id)
            ->where('habit_logs.date', '>=', $thisMonth)
            ->where('habit_logs.completed', true)
            ->select('habits.name', DB::raw('count(*) as count'))
            ->groupBy('habits.id', 'habits.name')
            ->orderBy('count', 'desc')
            ->first();

        return response()->json([
            'average_mood' => round($avgMood, 1),
            'journal_entries' => $journalCount,
            'top_habit' => $topHabit ? $topHabit->name : null,
            'top_habit_count' => $topHabit ? $topHabit->count : 0
        ]);
    }
}