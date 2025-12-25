import { Head, router } from '@inertiajs/react';
import { useState, FormEvent } from 'react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';

const moodEmojis = {
    0: '😢',
    1: '😟',
    2: '😐',
    3: '😊',
    4: '😄',
};

const moodLabels = {
    0: 'Très mal',
    1: 'Pas bien',
    2: 'Moyen',
    3: 'Bien',
    4: 'Très bien',
};

export default function JournalCreate() {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        mood_level: null as number | null,
    });
    const [loading, setLoading] = useState(false);
    const [charCount, setCharCount] = useState(0);

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setFormData({ ...formData, content: value });
        setCharCount(value.length);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (!formData.content.trim()) {
            alert('Veuillez écrire du contenu');
            return;
        }

        setLoading(true);
        router.post('/journal', formData, {
            onFinish: () => setLoading(false),
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Nouvelle Entrée - Journal" />

            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-gray-800 mb-2">
                            ✍️ Nouvelle Entrée de Journal
                        </h1>
                        <p className="text-gray-600">
                            Prenez un moment pour exprimer vos pensées et émotions
                        </p>
                    </div>

                    {/* Formulaire */}
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Card principale */}
                        <div className="bg-white rounded-2xl shadow-lg p-8">

                            {/* Titre */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Titre (optionnel)
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Donnez un titre à votre entrée..."
                                    maxLength={100}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                                />
                            </div>

                            {/* Humeur */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Comment vous sentez-vous ? (optionnel)
                                </label>
                                <div className="flex justify-around">
                                    {[0, 1, 2, 3, 4].map((mood) => (
                                        <button
                                            key={mood}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, mood_level: mood })}
                                            className={`flex flex-col items-center p-3 rounded-xl transition-all transform hover:scale-110 ${formData.mood_level === mood
                                                    ? 'bg-purple-100 ring-4 ring-purple-400 scale-110'
                                                    : 'hover:bg-gray-100'
                                                }`}
                                        >
                                            <span className="text-4xl mb-1">
                                                {moodEmojis[mood as keyof typeof moodEmojis]}
                                            </span>
                                            <span className="text-xs font-medium text-gray-700">
                                                {moodLabels[mood as keyof typeof moodLabels]}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Contenu */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Votre entrée *
                                </label>
                                <textarea
                                    value={formData.content}
                                    onChange={handleContentChange}
                                    placeholder="Écrivez librement vos pensées, ce qui vous préoccupe, ce qui vous rend heureux...

Prenez votre temps, cet espace est privé et sécurisé. 💭"
                                    required
                                    rows={12}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-lg leading-relaxed"
                                />
                                <div className="flex justify-between items-center mt-2">
                                    <p className="text-sm text-gray-500">
                                        {charCount} caractère{charCount > 1 ? 's' : ''}
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        💡 Conseil : Soyez honnête avec vous-même
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Boutons d'action */}
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => router.visit('/journal')}
                                className="flex-1 px-6 py-4 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors text-center"
                            >
                                ← Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={loading || !formData.content.trim()}
                                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-4 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none shadow-lg"
                            >
                                {loading ? '✨ Enregistrement...' : '✅ Enregistrer l\'entrée'}
                            </button>
                        </div>

                        {/* Info privacité */}
                        <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4">
                            <p className="text-sm text-purple-800 text-center">
                                🔒 Votre journal est entièrement privé. Personne d'autre ne peut voir vos entrées.
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}