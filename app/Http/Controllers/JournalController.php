<?php

namespace App\Http\Controllers;

use App\Models\JournalEntry;
use Illuminate\Http\Request;
use Inertia\Inertia;

class JournalController extends Controller
{
    public function index()
    {
        $entries = JournalEntry::where('user_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('journal/index', [
            'entries' => $entries,
        ]);
    }

    public function create()
    {
        return Inertia::render('journal/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'content' => 'required|string',
            'mood_level' => 'nullable|integer|min:0|max:4',
        ]);

        JournalEntry::create([
            'user_id' => auth()->id(),
            'title' => $validated['title'] ?? null,
            'content' => $validated['content'],
            'mood_level' => $validated['mood_level'] ?? null,
        ]);

        return redirect()->route('journal.index')->with('success', 'Entrée créée');
    }

    public function destroy(JournalEntry $entry)
    {
        // Ensure user owns this entry
        if ($entry->user_id !== auth()->id()) {
            abort(403);
        }

        $entry->delete();

        return redirect()->back()->with('success', 'Entrée supprimée');
    }
}
