<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Habit;
use Illuminate\Http\Request;

class HabitController extends Controller
{
    public function index(Request $request)
    {
        $habits = $request->user()
            ->habits()
            ->where('is_active', true)
            ->get();

        return response()->json($habits);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|in:sommeil,sport,alimentation,mental,autre'
        ]);

        $habit = $request->user()->habits()->create($request->all());

        return response()->json($habit, 201);
    }

    public function update(Request $request, Habit $habit)
    {
        

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'category' => 'sometimes|required|in:sommeil,sport,alimentation,mental,autre',
            'is_active' => 'sometimes|boolean'
        ]);

        $habit->update($request->all());

        return response()->json($habit);
    }

    public function destroy(Habit $habit)
    {
       
        
        $habit->delete();

        return response()->json([
            'message' => 'Habitude supprimée'
        ]);
    }
}