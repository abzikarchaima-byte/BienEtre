<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\HabitLog;
use App\Models\Habit;
use Illuminate\Http\Request;
use Carbon\Carbon;

class HabitLogController extends Controller
{
    public function today(Request $request)
    {
        $habits = $request->user()->habits()->where('is_active', true)->get();
        
        $habitsWithLogs = $habits->map(function ($habit) use ($request) {
            $log = HabitLog::where('habit_id', $habit->id)
                ->where('user_id', $request->user()->id)
                ->whereDate('date', Carbon::today())
                ->first();

            return [
                'habit' => $habit,
                'completed' => $log ? $log->completed : false,
                'log_id' => $log ? $log->id : null
            ];
        });

        return response()->json($habitsWithLogs);
    }

    public function toggle(Request $request, Habit $habit)
    {
       

        $log = HabitLog::updateOrCreate(
            [
                'habit_id' => $habit->id,
                'user_id' => $request->user()->id,
                'date' => Carbon::today()
            ],
            [
                'completed' => $request->boolean('completed')
            ]
        );

        return response()->json($log);
    }
}