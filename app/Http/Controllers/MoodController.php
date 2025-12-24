<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Mood;
use Illuminate\Http\Request;
use Carbon\Carbon;

class MoodController extends Controller
{
    public function index(Request $request)
    {
        $moods = $request->user()
            ->moods()
            ->orderBy('date', 'desc')
            ->paginate(30);

        return response()->json($moods);
    }

    public function store(Request $request)
    {
        $request->validate([
            'mood_level' => 'required|integer|min:1|max:5',
            'note' => 'nullable|string|max:200'
        ]);

        $mood = $request->user()->moods()->updateOrCreate(
            ['date' => Carbon::today()],
            [
                'mood_level' => $request->mood_level,
                'note' => $request->note
            ]
        );

        // Suggestions basées sur l'humeur
        $suggestions = $this->getSuggestions($request->mood_level);

        return response()->json([
            'mood' => $mood,
            'suggestions' => $suggestions
        ], 201);
    }

    public function today(Request $request)
    {
        $mood = $request->user()
            ->moods()
            ->whereDate('date', Carbon::today())
            ->first();

        return response()->json($mood);
    }

    private function getSuggestions($moodLevel)
    {
        $suggestions = [
            1 => [
                'Prendre une pause de 10 minutes',
                'Écouter de la musique relaxante',
                'Appeler un ami proche',
                'Faire des exercices de respiration',
                'Prendre une douche chaude'
            ],
            2 => [
                'Faire une promenade de 15 minutes',
                'Écouter un podcast motivant',
                'Boire une tisane',
                'Écrire dans votre journal',
                'Regarder une vidéo inspirante'
            ],
            3 => [
                'Lire quelques pages d\'un livre',
                'Faire une activité créative',
                'Pratiquer le yoga',
                'Organiser votre espace de travail',
                'Écouter de la musique'
            ],
            4 => [
                'Faire du sport',
                'Apprendre quelque chose de nouveau',
                'Planifier un projet',
                'Appeler un ami',
                'Sortir prendre l\'air'
            ],
            5 => [
                'Faire une séance de sport intense',
                'Démarrer un nouveau projet',
                'Partager votre bonne humeur',
                'Écrire vos objectifs',
                'Célébrer vos réussites'
            ]
        ];

        return $suggestions[$moodLevel] ?? [];
    }
}