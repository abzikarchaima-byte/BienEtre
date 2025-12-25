<?php

namespace App\Http\Controllers;

use App\Models\HabitLog;
use App\Models\Habit;
use Illuminate\Http\Request;

class HabitLogController extends Controller
{
    public function toggle(Request $request, Habit $habit)
    {
        // Ensure user owns this habit
        if ($habit->user_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'completed' => 'required|boolean',
        ]);

        $today = today();

        // Find or create today's log
        $log = HabitLog::where('user_id', auth()->id())
            ->where('habit_id', $habit->id)
            ->whereDate('date', $today)
            ->first();

        if ($log) {
            $log->update(['completed' => $validated['completed']]);
        } else {
            HabitLog::create([
                'user_id' => auth()->id(),
                'habit_id' => $habit->id,
                'completed' => $validated['completed'],
                'date' => $today,
            ]);
        }

        return redirect()->back();
    }
}
