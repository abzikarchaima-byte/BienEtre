import { useState } from 'react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Head } from '@inertiajs/react';
import { moodApi, habitApi } from '@/lib/api';

// Types
interface Habit {
    id: number;
    name: string;
    category: string;
    is_active: boolean;
}

interface Mood {
    id: number;
    mood_level: number;
    note?: string;
}

interface HabitLog {
    habit_id: number;
    completed: boolean;
}

interface DashboardProps {
    habits: Habit[];
    todayMood?: Mood;
    habitLogs: Record<number, HabitLog>;
}

const moodEmojis = ['😢', '😕', '😐', '🙂', '😊'];
const moodLabels = ['Très mauvais', 'Mauvais', 'Moyen', 'Bien', 'Excellent'];

export default function Dashboard({ habits, todayMood, habitLogs }: DashboardProps) {
    const [selectedMood, setSelectedMood] = useState<number | null>(
        todayMood?.mood_level ?? null
    );
    const [moodNote, setMoodNote] = useState('');

    const handleMoodSubmit = () => {
        if (selectedMood === null) return;

        moodApi.store({
            mood_level: selectedMood,
            note: moodNote || undefined,
        });

        setMoodNote('');
    };

    const handleHabitToggle = (habitId: number, currentStatus: boolean) => {
        habitApi.toggle(habitId, !currentStatus);
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Tableau de bord
                </h2>
            }
        >
            <Head title="Tableau de bord" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* Section Humeur */}
                            <div className="mb-8">
                                <h3 className="mb-4 text-lg font-semibold">
                                    Comment vous sentez-vous aujourd'hui ?
                                </h3>

                                {todayMood ? (
                                    <div className="rounded-lg bg-blue-50 p-4">
                                        <p className="text-sm text-gray-600">
                                            Vous avez déjà enregistré votre humeur aujourd'hui :
                                        </p>
                                        <div className="mt-2 flex items-center gap-2">
                                            <span className="text-3xl">{moodEmojis[todayMood.mood_level]}</span>
                                            <span className="font-semibold">{moodLabels[todayMood.mood_level]}</span>
                                        </div>
                                        {todayMood.note && (
                                            <p className="mt-2 text-sm text-gray-700">Note : {todayMood.note}</p>
                                        )}
                                    </div>
                                ) : (
                                    <div>
                                        <div className="mb-4 flex justify-center gap-4">
                                            {moodEmojis.map((emoji, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setSelectedMood(index)}
                                                    className={`flex h-16 w-16 items-center justify-center rounded-full text-3xl transition-all ${selectedMood === index
                                                            ? 'scale-110 bg-blue-100 ring-2 ring-blue-500'
                                                            : 'bg-gray-100 hover:bg-gray-200'
                                                        }`}
                                                    title={moodLabels[index]}
                                                >
                                                    {emoji}
                                                </button>
                                            ))}
                                        </div>

                                        {selectedMood !== null && (
                                            <div className="mt-4">
                                                <textarea
                                                    value={moodNote}
                                                    onChange={(e) => setMoodNote(e.target.value)}
                                                    placeholder="Ajoutez une note (optionnel)..."
                                                    className="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                                                    rows={3}
                                                />
                                                <button
                                                    onClick={handleMoodSubmit}
                                                    className="mt-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                                                >
                                                    Enregistrer mon humeur
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Section Habitudes */}
                            <div>
                                <h3 className="mb-4 text-lg font-semibold">
                                    Mes habitudes du jour
                                </h3>

                                {habits.length === 0 ? (
                                    <p className="text-gray-500">
                                        Aucune habitude active. Créez-en une dans la section Habitudes.
                                    </p>
                                ) : (
                                    <div className="grid gap-3">
                                        {habits.map((habit) => {
                                            const isCompleted = habitLogs[habit.id]?.completed || false;

                                            return (
                                                <div
                                                    key={habit.id}
                                                    className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            onClick={() => handleHabitToggle(habit.id, isCompleted)}
                                                            className={`flex h-6 w-6 items-center justify-center rounded border-2 transition-all ${isCompleted
                                                                    ? 'border-green-500 bg-green-500'
                                                                    : 'border-gray-300 hover:border-green-400'
                                                                }`}
                                                        >
                                                            {isCompleted && (
                                                                <svg
                                                                    className="h-4 w-4 text-white"
                                                                    fill="none"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    viewBox="0 0 24 24"
                                                                    stroke="currentColor"
                                                                >
                                                                    <path d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            )}
                                                        </button>
                                                        <div>
                                                            <p
                                                                className={`font-medium ${isCompleted ? 'text-gray-400 line-through' : 'text-gray-900'
                                                                    }`}
                                                            >
                                                                {habit.name}
                                                            </p>
                                                            <p className="text-sm text-gray-500">{habit.category}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}