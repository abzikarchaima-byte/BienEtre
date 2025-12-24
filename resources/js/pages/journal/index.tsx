// resources/js/pages/journal/index.tsx
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true,
});

interface JournalEntry {
    id: number;
    title: string | null;
    content: string;
    mood_level: number | null;
    created_at: string;
}

const moodEmojis: Record<number, string> = {
    1: '😢',
    2: '😟',
    3: '😐',
    4: '😊',
    5: '😄',
};

export default function JournalIndex() {
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [viewEntry, setViewEntry] = useState<JournalEntry | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        if (!isInitialized) {
            loadEntries(1);
            setIsInitialized(true);
        }
    }, [isInitialized]);

    const loadEntries = async (page: number) => {
        try {
            const response = await api.get(`/journal?page=${page}`);
            setEntries(response.data.data || []);
            setCurrentPage(response.data.current_page || 1);
            setLastPage(response.data.last_page || 1);
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    const openEntry = (entry: JournalEntry) => {
        setViewEntry(entry);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setViewEntry(null);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette entrée ?')) return;

        try {
            await api.delete(`/journal/${id}`);
            closeModal();
            await loadEntries(currentPage);
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors de la suppression');
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const truncateText = (text: string, maxLength: number) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    return (
        <>
            <Head title="Mon Journal" />

            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-800 mb-2">
                                📝 Mon Journal Privé
                            </h1>
                            <p className="text-gray-600">
                                Exprimez vos pensées et suivez votre parcours
                            </p>
                        </div>
                        <a
                            href="/journal/create"
                            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg"
                        >
                            ✍️ Nouvelle entrée
                        </a>
                    </div>

                    {/* Liste des entrées */}
                    {entries.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                            <div className="text-6xl mb-4">📔</div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                Votre journal est vide
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Commencez à écrire vos pensées et émotions
                            </p>
                            <a
                                href="/journal/create"
                                className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all"
                            >
                                Écrire ma première entrée
                            </a>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {entries.map((entry) => (
                                <div
                                    key={entry.id}
                                    onClick={() => openEntry(entry)}
                                    className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all cursor-pointer p-6 transform hover:scale-[1.01]"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                {entry.mood_level && (
                                                    <span className="text-3xl">
                                                        {moodEmojis[entry.mood_level]}
                                                    </span>
                                                )}
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-800">
                                                        {entry.title || 'Sans titre'}
                                                    </h3>
                                                    <p className="text-sm text-gray-500">
                                                        {formatDate(entry.created_at)} à {formatTime(entry.created_at)}
                                                    </p>
                                                </div>
                                            </div>
                                            <p className="text-gray-600 leading-relaxed">
                                                {truncateText(entry.content, 200)}
                                            </p>
                                        </div>
                                        <button
                                            className="text-gray-400 hover:text-purple-600 transition-colors ml-4"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {lastPage > 1 && (
                        <div className="flex justify-center gap-2 mt-8">
                            <button
                                onClick={() => loadEntries(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-4 py-2 rounded-lg bg-white shadow hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                            >
                                ← Précédent
                            </button>
                            <span className="px-4 py-2 bg-white rounded-lg shadow font-medium">
                                Page {currentPage} / {lastPage}
                            </span>
                            <button
                                onClick={() => loadEntries(currentPage + 1)}
                                disabled={currentPage === lastPage}
                                className="px-4 py-2 rounded-lg bg-white shadow hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                            >
                                Suivant →
                            </button>
                        </div>
                    )}

                    {/* Bouton retour */}
                    <div className="mt-8">
                        <a
                            href="/dashboard"
                            className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium"
                        >
                            ← Retour au dashboard
                        </a>
                    </div>
                </div>
            </div>

            {/* Modal Détail */}
            {showModal && viewEntry && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-8 my-8">
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-3">
                                {viewEntry.mood_level && (
                                    <span className="text-4xl">
                                        {moodEmojis[viewEntry.mood_level]}
                                    </span>
                                )}
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-800">
                                        {viewEntry.title || 'Sans titre'}
                                    </h2>
                                    <p className="text-gray-500 mt-1">
                                        {formatDate(viewEntry.created_at)} à {formatTime(viewEntry.created_at)}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-gray-600 text-2xl"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="prose max-w-none mb-6">
                            <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                                {viewEntry.content}
                            </p>
                        </div>

                        <div className="flex gap-3 pt-4 border-t">
                            <a
                                href={`/journal/${viewEntry.id}/edit`}
                                className="flex-1 bg-blue-500 text-white px-4 py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors text-center"
                            >
                                ✏️ Modifier
                            </a>
                            <button
                                onClick={() => handleDelete(viewEntry.id)}
                                className="flex-1 bg-red-500 text-white px-4 py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors"
                            >
                                🗑️ Supprimer
                            </button>
                            <button
                                onClick={closeModal}
                                className="px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}