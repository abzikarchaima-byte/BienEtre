import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MoodData {
    date: string;
    mood_level: number;
}

interface HabitStat {
    name: string;
    category: string;
    completion_rate: number;
    completed_days: number;
}

interface Summary {
    total_moods: number;
    average_mood: number;
    total_journal_entries: number;
    total_habits_completed: number;
}

interface StatisticsProps {
    moodChart: MoodData[];
    habitStats: HabitStat[];
    summary: Summary;
}

const moodEmojis: Record<number, string> = {
    0: '😢',
    1: '😟',
    2: '😐',
    3: '😊',
    4: '😄',
};

export default function StatisticsIndex({ moodChart, habitStats, summary }: StatisticsProps) {
    const getMoodEmoji = (average: number) => {
        const rounded = Math.round(average);
        return moodEmojis[rounded] || '😐';
    };

    const chartData = moodChart.map(item => ({
        date: new Date(item.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
        humeur: item.mood_level,
    }));

    return (
        <AuthenticatedLayout>
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* Humeur moyenne */}
                        <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl shadow-lg p-6 text-white">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-lg font-semibold opacity-90">Humeur Moyenne</h3>
                                <span className="text-4xl">{getMoodEmoji(summary.average_mood)}</span>
                            </div>
                            <p className="text-4xl font-bold">{summary.average_mood.toFixed(1)}/4</p>
                            <p className="text-sm opacity-90 mt-2">Ce mois-ci</p>
                        </div>

                        {/* Entrées journal */}
                        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg p-6 text-white">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-lg font-semibold opacity-90">Entrées Journal</h3>
                                <span className="text-4xl">📝</span>
                            </div>
                            <p className="text-4xl font-bold">{summary.total_journal_entries}</p>
                            <p className="text-sm opacity-90 mt-2">Ce mois-ci</p>
                        </div>

                        {/* Habitudes complétées */}
                        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl shadow-lg p-6 text-white">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-lg font-semibold opacity-90">Habitudes Complétées</h3>
                                <span className="text-4xl">🏆</span>
                            </div>
                            <p className="text-4xl font-bold">{summary.total_habits_completed}</p>
                            <p className="text-sm opacity-90 mt-2">Ce mois-ci</p>
                        </div>
                    </div>

                    {/* Graphique de l'humeur */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">
                            📈 Évolution de l'humeur (30 derniers jours)
                        </h2>

                        {chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis
                                        dataKey="date"
                                        stroke="#888"
                                        style={{ fontSize: '12px' }}
                                    />
                                    <YAxis
                                        domain={[0, 4]}
                                        ticks={[0, 1, 2, 3, 4]}
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
                            {[0, 1, 2, 3, 4].map((level) => (
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
                            🎯 Performance des Habitudes (30 derniers jours)
                        </h2>

                        {habitStats.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {habitStats.map((stat, index) => (
                                    <div key={index} className="border-2 border-gray-100 rounded-xl p-4 hover:border-blue-200 transition-colors">
                                        <div className="flex items-start justify-between mb-3">
                                            <h3 className="font-semibold text-gray-800">
                                                {stat.name}
                                            </h3>
                                            <span className={`text-xs px-2 py-1 rounded-full ${stat.completion_rate >= 80 ? 'bg-green-100 text-green-700' :
                                                    stat.completion_rate >= 50 ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-red-100 text-red-700'
                                                }`}>
                                                {stat.category}
                                            </span>
                                        </div>

                                        {/* Barre de progression */}
                                        <div className="mb-3">
                                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                                                <span>Taux de réussite</span>
                                                <span className="font-semibold">{stat.completion_rate}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div
                                                    className={`h-2.5 rounded-full transition-all ${stat.completion_rate >= 80 ? 'bg-green-500' :
                                                            stat.completion_rate >= 50 ? 'bg-yellow-500' :
                                                                'bg-red-500'
                                                        }`}
                                                    style={{ width: `${stat.completion_rate}%` }}
                                                />
                                            </div>
                                        </div>

                                        {/* Stats */}
                                        <div className="flex justify-between text-sm text-gray-600">
                                            <span>✅ {stat.completed_days} jours</span>
                                            <span>📅 30 total</span>
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
                </div>
            </div>
        </AuthenticatedLayout>
    );
}