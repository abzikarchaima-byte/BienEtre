<?php

namespace App\Http\Controllers;

use App\Models\Mood;
use Illuminate\Http\Request;

class MoodController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'mood_level' => 'required|integer|min:0|max:4',
            'note' => 'nullable|string|max:500',
        ]);

        // Check if mood already exists for today
        $existingMood = Mood::where('user_id', auth()->id())
            ->whereDate('date', today())
            ->first();

        if ($existingMood) {
            $existingMood->update($validated);
        } else {
            Mood::create([
                'user_id' => auth()->id(),
                'mood_level' => $validated['mood_level'],
                'note' => $validated['note'] ?? null,
                'date' => today(),
            ]);
        }

        return redirect()->back()->with('success', 'Humeur enregistrée');
    }
}
