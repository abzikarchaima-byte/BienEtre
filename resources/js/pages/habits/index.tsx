import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';

interface Habit {
    id: number;
    name: string;
    category: string;
    is_active: boolean;
}

interface HabitsProps {
    habits: Habit[];
}

const categories = [
    { value: 'sommeil', label: 'Sommeil', emoji: '😴', color: 'bg-blue-100 text-blue-700' },
    { value: 'sport', label: 'Sport', emoji: '🏃', color: 'bg-green-100 text-green-700' },
    { value: 'alimentation', label: 'Alimentation', emoji: '🥗', color: 'bg-orange-100 text-orange-700' },
    { value: 'mental', label: 'Mental', emoji: '🧠', color: 'bg-purple-100 text-purple-700' },
    { value: 'autre', label: 'Autre', emoji: '✨', color: 'bg-gray-100 text-gray-700' },
];

export default function HabitsIndex({ habits }: HabitsProps) {
    const [showModal, setShowModal] = useState(false);
    const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
    const [formData, setFormData] = useState({ name: '', category: 'sommeil' });
    const [loading, setLoading] = useState(false);

    const openCreateModal = () => {
        setEditingHabit(null);
        setFormData({ name: '', category: 'sommeil' });
        setShowModal(true);
    };

    const openEditModal = (habit: Habit) => {
        setEditingHabit(habit);
        setFormData({ name: habit.name, category: habit.category });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingHabit(null);
        setFormData({ name: '', category: 'sommeil' });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (editingHabit) {
            router.put(`/habits/${editingHabit.id}`, formData, {
                preserveScroll: true,
                onSuccess: () => closeModal(),
                onFinish: () => setLoading(false),
            });
        } else {
            router.post('/habits', formData, {
                preserveScroll: true,
                onSuccess: () => closeModal(),
                onFinish: () => setLoading(false),
            });
        }
    };

    const handleDelete = (id: number) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette habitude ?')) return;

        router.delete(`/habits/${id}`, {
            preserveScroll: true,
        });
    };

    const getCategoryInfo = (category: string) => {
        return categories.find(c => c.value === category) || categories[4];
    };

    return (
        <AuthenticatedLayout>
            <Head title="Mes Habitudes" />

            <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-800 mb-2">
                                📋 Mes Habitudes
                            </h1>
                            <p className="text-gray-600">
                                Gérez vos habitudes quotidiennes pour améliorer votre bien-être
                            </p>
                        </div>
                        <button
                            onClick={openCreateModal}
                            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-105 shadow-lg"
                        >
                            ➕ Nouvelle habitude
                        </button>
                    </div>

                    {/* Suggestions */}
                    {habits.length === 0 && (
                        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-6">
                            <h3 className="text-lg font-semibold text-blue-800 mb-3">
                                💡 Suggestions d'habitudes pour commencer :
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="flex items-center gap-2 text-gray-700">
                                    <span>😴</span> Dormir 7-8 heures
                                </div>
                                <div className="flex items-center gap-2 text-gray-700">
                                    <span>🏃</span> Faire du sport (30 min)
                                </div>
                                <div className="flex items-center gap-2 text-gray-700">
                                    <span>💧</span> Boire 1.5L d'eau
                                </div>
                                <div className="flex items-center gap-2 text-gray-700">
                                    <span>🧘</span> Méditer (10 min)
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Liste des habitudes */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {habits.map((habit) => {
                            const categoryInfo = getCategoryInfo(habit.category);
                            return (
                                <div
                                    key={habit.id}
                                    className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <span className="text-3xl">{categoryInfo.emoji}</span>
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-800">
                                                    {habit.name}
                                                </h3>
                                                <span className={`inline-block text-xs px-3 py-1 rounded-full mt-1 ${categoryInfo.color}`}>
                                                    {categoryInfo.label}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => openEditModal(habit)}
                                                className="text-blue-600 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Modifier"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                onClick={() => handleDelete(habit.id)}
                                                className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Supprimer"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>
                                    <div className={`text-sm ${habit.is_active ? 'text-green-600' : 'text-gray-400'}`}>
                                        {habit.is_active ? '✓ Active' : '✗ Désactivée'}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {habits.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg mb-4">
                                Vous n'avez pas encore d'habitudes configurées
                            </p>
                            <button
                                onClick={openCreateModal}
                                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all"
                            >
                                Créer ma première habitude
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Créer/Modifier */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">
                            {editingHabit ? '✏️ Modifier l\'habitude' : '➕ Nouvelle habitude'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Nom */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nom de l'habitude *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Ex: Faire du sport 30 minutes"
                                    required
                                    maxLength={255}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* Catégorie */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Catégorie *
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat.value}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, category: cat.value })}
                                            className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all ${formData.category === cat.value
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <span className="text-2xl">{cat.emoji}</span>
                                            <span className="font-medium text-gray-700">{cat.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Boutons */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all disabled:opacity-50"
                                >
                                    {loading ? 'Enregistrement...' : editingHabit ? 'Modifier' : 'Créer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}