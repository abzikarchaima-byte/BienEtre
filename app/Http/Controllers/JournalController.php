<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\JournalEntry;
use Illuminate\Http\Request;

class JournalController extends Controller
{
    public function index(Request $request)
    {
        $entries = $request->user()
            ->journalEntries()
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json($entries);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'nullable|string|max:100',
            'content' => 'required|string',
            'mood_level' => 'nullable|integer|min:1|max:5'
        ]);

        $entry = $request->user()->journalEntries()->create($request->all());

        return response()->json($entry, 201);
    }

    public function show(JournalEntry $entry)
    {
        

        return response()->json($entry);
    }

    public function update(Request $request, JournalEntry $entry)
    {
       

        $request->validate([
            'title' => 'nullable|string|max:100',
            'content' => 'sometimes|required|string',
            'mood_level' => 'nullable|integer|min:1|max:5'
        ]);

        $entry->update($request->all());

        return response()->json($entry);
    }

    public function destroy(JournalEntry $entry)
    {
       

        $entry->delete();

        return response()->json([
            'message' => 'Entrée supprimée'
        ]);
    }
}