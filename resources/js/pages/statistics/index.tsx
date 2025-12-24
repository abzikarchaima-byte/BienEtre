// resources/js/pages/statistics/index.tsx
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true,
});

const moodEmojis: Record<number, string> = {
    1: '😢',
    2: '😟',
    3: '😐',
    4: '😊',
    5: '😄',
};

export default function StatisticsIndex() {
    const [moodData, setMoodData] = useState<any[]>([]);
    const [habitStats, setHabitStats] = useState<any[]>([]);
    const [summary, setSummary] = useState<any>(null);
    const [selectedPeriod, setSelectedPeriod] = useState(30);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        if (!isInitialized) {
            loadAllStats();
            setIsInitialized(true);
        }
    }, [isInitialized]);

    useEffect(() => {
        if (isInitialized) {
            loadMoodChart();
        }
    }, [selectedPeriod]);

    const loadAllStats = async () => {
        await Promise.all([
            loadMoodChart(),
            loadHabitStats(),
            loadSummary(),
        ]);
    };

    const loadMoodChart = async () => {
        try {
            const response = await api.get(`/statistics/mood-chart?days=${selectedPeriod}`);
            const formattedData = response.data.map((item: any) => ({
                date: new Date(item.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
                humeur: item.mood_level,
            }));
            setMoodData(formattedData);
        } catch (error) {
            console.error('Erreur mood chart:', error);
            setMoodData([]);
        }
    };

    const loadHabitStats = async () => {
        try {
            const response = await api.get('/statistics/habits');
            setHabitStats(response.data);
        } catch (error) {
            console.error('Erreur habit stats:', error);
            setHabitStats([]);
        }
    };

    const loadSummary = async () => {
        try {
            const response = await api.get('/statistics/summary');
            setSummary(response.data);
        } catch (error) {
            console.error('Erreur summary:', error);
            setSummary(null);
        }
    };

    const getMoodEmoji = (average: number) => {
        const rounded = Math.round(average);
        return moodEmojis[rounded] || '😐';
    };

    return (
        <>
            <Head title="Mes Statistiques" />

            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-gray-800 mb-2">
                            📊 Mes Statistiques
                        </h1>
                        <p className="text-gray-600">
                            Visualisez votre progression et vos habitudes
                        </p>
                    </div>

                    {/* Résumé mensuel */}
                    {summary && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            {/* Humeur moyenne */}
                            <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl shadow-lg p-6 text-white">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-lg font-semibold opacity-90">Humeur Moyenne</h3>
                                    <span className="text-4xl">{getMoodEmoji(summary.average_mood)}</span>
                                </div>
                                <p className="text-4xl font-bold">{summary.average_mood.toFixed(1)}/5</p>
                                <p className="text-sm opacity-90 mt-2">Ce mois-ci</p>
                            </div>

                            {/* Entrées journal */}
                            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg p-6 text-white">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-lg font-semibold opacity-90">Entrées Journal</h3>
                                    <span className="text-4xl">📝</span>
                                </div>
                                <p className="text-4xl font-bold">{summary.journal_entries}</p>
                                <p className="text-sm opacity-90 mt-2">Ce mois-ci</p>
                            </div>

                            {/* Habitude star */}
                            <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl shadow-lg p-6 text-white">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-lg font-semibold opacity-90">Habitude ⭐</h3>
                                    <span className="text-4xl">🏆</span>
                                </div>
                                <p className="text-xl font-bold truncate">
                                    {summary.top_habit || 'Aucune'}
                                </p>
                                <p className="text-sm opacity-90 mt-2">
                                    {summary.top_habit_count} fois ce mois
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Graphique de l'humeur */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">
                                📈 Évolution de l'humeur
                            </h2>
                            <div className="flex gap-2">
                                {[7, 30, 90].map((days) => (
                                    <button
                                        key={days}
                                        onClick={() => setSelectedPeriod(days)}
                                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                            selectedPeriod === days
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    >
                                        {days}j
                                    </button>
                                ))}
                            </div>
                        </div>

                        {moodData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={moodData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis 
                                        dataKey="date" 
                                        stroke="#888"
                                        style={{ fontSize: '12px' }}
                                    />
                                    <YAxis 
                                        domain={[0, 5]} 
                                        ticks={[1, 2, 3, 4, 5]}
                                        stroke="#888"
                                        style={{ fontSize: '12px' }}
                                    />
                                    <Tooltip 
                                        contentStyle={{ 
                                            backgroundColor: 'white', 
                                            border: '1px solid #ddd',
                                            borderRadius: '8px',
                                            padding: '10px'
                                        }}
                                        labelStyle={{ fontWeight: 'bold' }}
                                    />
                                    <Line 
                                        type="monotone" 
                                        dataKey="humeur" 
                                        stroke="#8b5cf6" 
                                        strokeWidth={3}
                                        dot={{ fill: '#8b5cf6', r: 5 }}
                                        activeDot={{ r: 7 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="text-center py-12 text-gray-500">
                                Pas encore de données pour cette période
                            </div>
                        )}

                        {/* Légende */}
                        <div className="flex justify-center gap-6 mt-6 text-sm">
                            {[1, 2, 3, 4, 5].map((level) => (
                                <div key={level} className="flex items-center gap-2">
                                    <span className="text-2xl">{moodEmojis[level]}</span>
                                    <span className="text-gray-600">{level}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Statistiques des habitudes */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">
                            🎯 Performance des Habitudes
                        </h2>

                        {habitStats.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {habitStats.map((stat: any) => (
                                    <div key={stat.habit.id} className="border-2 border-gray-100 rounded-xl p-4 hover:border-blue-200 transition-colors">
                                        <div className="flex items-start justify-between mb-3">
                                            <h3 className="font-semibold text-gray-800">
                                                {stat.habit.name}
                                            </h3>
                                            <span className={`text-xs px-2 py-1 rounded-full ${
                                                stat.success_rate >= 80 ? 'bg-green-100 text-green-700' :
                                                stat.success_rate >= 50 ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-red-100 text-red-700'
                                            }`}>
                                                {stat.habit.category}
                                            </span>
                                        </div>

                                        {/* Barre de progression */}
                                        <div className="mb-3">
                                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                                                <span>Taux de réussite</span>
                                                <span className="font-semibold">{stat.success_rate}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div
                                                    className={`h-2.5 rounded-full transition-all ${
                                                        stat.success_rate >= 80 ? 'bg-green-500' :
                                                        stat.success_rate >= 50 ? 'bg-yellow-500' :
                                                        'bg-red-500'
                                                    }`}
                                                    style={{ width: `${stat.success_rate}%` }}
                                                />
                                            </div>
                                        </div>

                                        {/* Stats */}
                                        <div className="flex justify-between text-sm text-gray-600">
                                            <span>✅ {stat.completed_count} jours</span>
                                            <span>📅 {stat.total_days} total</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-500">
                                Pas encore de données sur vos habitudes
                            </div>
                        )}
                    </div>

                    {/* Bouton retour */}
                    <div className="mt-8">
                        <a
                            href="/dashboard"
                            className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium"
                        >
                            ← Retour au dashboard
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}