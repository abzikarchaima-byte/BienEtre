<?php

namespace App\Http\Controllers;

use App\Models\Habit;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HabitController extends Controller
{
    public function index()
    {
        $habits = Habit::where('user_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('habits/index', [
            'habits' => $habits,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
        ]);

        Habit::create([
            'user_id' => auth()->id(),
            'name' => $validated['name'],
            'category' => $validated['category'],
            'is_active' => true,
        ]);

        return redirect()->back()->with('success', 'Habitude créée avec succès');
    }

    public function update(Request $request, Habit $habit)
    {
        // Ensure user owns this habit
        if ($habit->user_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'category' => 'sometimes|string|max:255',
            'is_active' => 'sometimes|boolean',
        ]);

        $habit->update($validated);

        return redirect()->back()->with('success', 'Habitude mise à jour');
    }

    public function destroy(Habit $habit)
    {
        // Ensure user owns this habit
        if ($habit->user_id !== auth()->id()) {
            abort(403);
        }

        $habit->delete();

        return redirect()->back()->with('success', 'Habitude supprimée');
    }
}
