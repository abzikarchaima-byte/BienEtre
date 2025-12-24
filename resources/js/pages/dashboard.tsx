// resources/js/pages/dashboard.tsx
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import api, { moodApi, habitApi } from '@/lib/api';



// Émojis pour les humeurs
const moodEmojis = {
    1: '😢',
    2: '😟',
    3: '😐',
    4: '😊',
    5: '😄',
};

const moodLabels = {
    1: 'Très mal',
    2: 'Pas bien',
    3: 'Moyen',
    4: 'Bien',
    5: 'Très bien',
};

// Citations motivantes
const quotes = [
    "Chaque jour est une nouvelle chance de progresser.",
    "Prends soin de toi, tu le mérites.",
    "Les petits pas mènent à de grands changements.",
    "Ta santé mentale est une priorité.",
    "Sois fier de chaque progrès, même le plus petit.",
];

export default function Dashboard() {
    const [selectedMood, setSelectedMood] = useState<number | null>(null);
    const [note, setNote] = useState('');
    const [todayMood, setTodayMood] = useState<any>(null);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [habits, setHabits] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [quote] = useState(() => quotes[Math.floor(Math.random() * quotes.length)]);
    const [userName] = useState('Étudiant');
    const [isInitialized, setIsInitialized] = useState(false);

    // Charger les données une seule fois au montage
    useEffect(() => {
        if (!isInitialized) {
            loadDashboardData();
            setIsInitialized(true);
        }
    }, [isInitialized]);

    const loadDashboardData = async () => {
        try {
            await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
            withCredentials: true
        });

        // Extract XSRF-TOKEN from cookies
        const getCookie = (name: string) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop()?.split(';').shift();
            return null;
        };

        const xsrfToken = getCookie('XSRF-TOKEN');
        
        // Update axios instance headers
        if (xsrfToken) {
            api.defaults.headers.common['X-XSRF-TOKEN'] = decodeURIComponent(xsrfToken);
        }
            try {
                const moodRes = await api.get('/moods/today');
                if (moodRes.data) {
                    setTodayMood(moodRes.data);
                }
            } catch (err: any) {
                // 404 = pas d'humeur aujourd'hui, c'est normal
                if (err.response?.status !== 404) {
                    console.error('Erreur humeur:', err);
                }
            }

            // Charger les habitudes du jour
            try {
                const habitsRes = await api.get('/habit-logs/today');
                setHabits(habitsRes.data || []);
            } catch (err: any) {
                // 401 = pas connecté, ignorer pour l'instant
                if (err.response?.status !== 401) {
                    console.error('Erreur habitudes:', err);
                }
                setHabits([]);
            }
        } catch (error) {
            console.error('Erreur lors du chargement:', error);
        }
    };

    const getSuggestions = (moodLevel: number): string[] => {
        const allSuggestions: Record<number, string[]> = {
            1: [
                'Prendre une pause de 10 minutes',
                'Écouter de la musique relaxante',
                'Appeler un ami proche',
                'Faire des exercices de respiration',
                'Prendre une douche chaude'
            ],
            2: [
                'Faire une promenade de 15 minutes',
                'Écouter un podcast motivant',
                'Boire une tisane',
                'Écrire dans votre journal',
                'Regarder une vidéo inspirante'
            ],
            3: [
                'Lire quelques pages d\'un livre',
                'Faire une activité créative',
                'Pratiquer le yoga',
                'Organiser votre espace de travail',
                'Écouter de la musique'
            ],
            4: [
                'Faire du sport',
                'Apprendre quelque chose de nouveau',
                'Planifier un projet',
                'Appeler un ami',
                'Sortir prendre l\'air'
            ],
            5: [
                'Faire une séance de sport intense',
                'Démarrer un nouveau projet',
                'Partager votre bonne humeur',
                'Écrire vos objectifs',
                'Célébrer vos réussites'
            ]
        };
        return allSuggestions[moodLevel] || [];
    };

    const handleMoodSubmit = async () => {
        if (!selectedMood) return;

        setLoading(true);
        try {
            const moodRes = await moodApi.getToday();

            setTodayMood(moodRes.data.mood);
            const newSuggestions = getSuggestions(selectedMood);
            setSuggestions(newSuggestions);
            
            // Reset
            setSelectedMood(null);
            setNote('');
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors de l\'enregistrement');
        } finally {
            setLoading(false);
        }
    };

    const handleHabitToggle = async (habitId: number, currentStatus: boolean) => {
        try {
            await api.post(`/habits/${habitId}/toggle`, {
                completed: !currentStatus
            });
            // Recharger les habitudes
            const habitsRes = await api.get('/habit-logs/today');
            setHabits(habitsRes.data || []);
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    const completedHabits = habits.filter(h => h.completed).length;
    const totalHabits = habits.length;
    const progressPercentage = totalHabits > 0 ? (completedHabits / totalHabits) * 100 : 0;

    return (
        <>
            <Head title="Dashboard" />
            
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-gray-800 mb-2">
                            Bonjour {userName} ! 👋
                        </h1>
                        <p className="text-lg text-gray-600 italic">
                            "{quote}"
                        </p>
                    </div>

                    {/* Grille principale */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* Colonne gauche - Humeur */}
                        <div className="lg:col-span-2 space-y-6">
                            
                            {/* Card - Enregistrer l'humeur */}
                            {!todayMood && (
                                <div className="bg-white rounded-2xl shadow-lg p-6">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                                        Comment vous sentez-vous aujourd'hui ? 💭
                                    </h2>
                                    
                                    {/* Sélecteur d'humeur */}
                                    <div className="flex justify-around mb-6">
                                        {[1, 2, 3, 4, 5].map((mood) => (
                                            <button
                                                key={mood}
                                                onClick={() => setSelectedMood(mood)}
                                                className={`flex flex-col items-center p-4 rounded-xl transition-all transform hover:scale-110 ${
                                                    selectedMood === mood
                                                        ? 'bg-blue-100 ring-4 ring-blue-400 scale-110'
                                                        : 'hover:bg-gray-100'
                                                }`}
                                            >
                                                <span className="text-5xl mb-2">{moodEmojis[mood as keyof typeof moodEmojis]}</span>
                                                <span className="text-sm font-medium text-gray-700">
                                                    {moodLabels[mood as keyof typeof moodLabels]}
                                                </span>
                                            </button>
                                        ))}
                                    </div>

                                    {/* Note optionnelle */}
                                    {selectedMood && (
                                        <div className="space-y-4">
                                            <textarea
                                                value={note}
                                                onChange={(e) => setNote(e.target.value)}
                                                placeholder="Ajoutez une note (optionnel, max 200 caractères)..."
                                                maxLength={200}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                                rows={3}
                                            />
                                            <button
                                                onClick={handleMoodSubmit}
                                                disabled={loading}
                                                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-3 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-105 disabled:opacity-50"
                                            >
                                                {loading ? 'Enregistrement...' : 'Enregistrer mon humeur'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Humeur déjà enregistrée */}
                            {todayMood && (
                                <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl shadow-lg p-6 text-white">
                                    <h2 className="text-2xl font-bold mb-3">✅ Humeur du jour enregistrée</h2>
                                    <div className="flex items-center gap-4">
                                        <span className="text-6xl">{moodEmojis[todayMood.mood_level as keyof typeof moodEmojis]}</span>
                                        <div>
                                            <p className="text-xl font-semibold">{moodLabels[todayMood.mood_level as keyof typeof moodLabels]}</p>
                                            {todayMood.note && (
                                                <p className="text-white/90 mt-2">{todayMood.note}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Suggestions */}
                            {suggestions.length > 0 && (
                                <div className="bg-white rounded-2xl shadow-lg p-6">
                                    <h3 className="text-xl font-bold text-gray-800 mb-4">💡 Suggestions pour vous</h3>
                                    <ul className="space-y-3">
                                        {suggestions.map((suggestion, index) => (
                                            <li key={index} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                                                <span className="text-2xl">✨</span>
                                                <span className="text-gray-700">{suggestion}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Colonne droite - Habitudes */}
                        <div className="space-y-6">
                            
                            {/* Card - Habitudes du jour */}
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">
                                    📋 Mes habitudes du jour
                                </h3>

                                {/* Barre de progression */}
                                <div className="mb-6">
                                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                                        <span>Progression</span>
                                        <span className="font-semibold">{completedHabits}/{totalHabits}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                        <div
                                            className="bg-gradient-to-r from-green-400 to-blue-500 h-full transition-all duration-500"
                                            style={{ width: `${progressPercentage}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Liste des habitudes */}
                                <div className="space-y-3">
                                    {habits.length === 0 ? (
                                        <p className="text-gray-500 text-center py-4">
                                            Aucune habitude configurée
                                        </p>
                                    ) : (
                                        habits.map((habitData) => (
                                            <label
                                                key={habitData.habit.id}
                                                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={habitData.completed}
                                                    onChange={() => handleHabitToggle(habitData.habit.id, habitData.completed)}
                                                    className="w-5 h-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-500"
                                                />
                                                <span className={`flex-1 ${habitData.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                                                    {habitData.habit.name}
                                                </span>
                                                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                                                    {habitData.habit.category}
                                                </span>
                                            </label>
                                        ))
                                    )}
                                </div>

                                <a
                                    href="/habits"
                                    className="block mt-4 text-center text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    Gérer mes habitudes →
                                </a>
                            </div>

                            {/* Bouton Journal */}
                            <a
                                href="/journal"
                                className="block bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl shadow-lg p-6 hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-xl font-bold mb-1">📝 Mon Journal</h3>
                                        <p className="text-white/90">Écrire une nouvelle entrée</p>
                                    </div>
                                    <span className="text-4xl">✍️</span>
                                </div>
                            </a>

                            {/* Bouton Statistiques */}
                            <a
                                href="/statistics"
                                className="block bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-2xl shadow-lg p-6 hover:from-orange-500 hover:to-red-600 transition-all transform hover:scale-105"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-xl font-bold mb-1">📊 Statistiques</h3>
                                        <p className="text-white/90">Voir ma progression</p>
                                    </div>
                                    <span className="text-4xl">📈</span>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}