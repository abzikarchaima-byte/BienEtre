// resources/js/lib/api.ts
import axios from 'axios';

// Configuration de base d'axios pour Inertia
const api = axios.create({
    baseURL: 'http://localhost:8000/api', // Pas besoin de localhost:8000 avec Inertia
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest', // Important pour Laravel
    },
    withCredentials: true, // Important pour les cookies de session
});

// Intercepteur pour gérer les erreurs de réponse
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Non authentifié - rediriger vers login
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// ============================================
// AUTHENTIFICATION
// ============================================
export const authApi = {
    register: (data: { name: string; email: string; password: string; password_confirmation: string }) =>
        api.post('/register', data),
    
    login: (data: { email: string; password: string }) =>
        api.post('/login', data),
    
    logout: () =>
        api.post('/logout'),
    
    getUser: () =>
        api.get('/user'),
};

// ============================================
// HUMEUR (MOODS)
// ============================================
export const moodApi = {
    getAll: () =>
        api.get('/moods'),
    
    getToday: () =>
        api.get('/moods/today'),
    
    store: (data: { mood_level: number; note?: string }) =>
        api.post('/moods', data),
};

// ============================================
// HABITUDES (HABITS)
// ============================================
export const habitApi = {
    getAll: () =>
        api.get('/habits'),
    
    create: (data: { name: string; category: string }) =>
        api.post('/habits', data),
    
    update: (id: number, data: { name?: string; category?: string; is_active?: boolean }) =>
        api.put(`/habits/${id}`, data),
    
    delete: (id: number) =>
        api.delete(`/habits/${id}`),
    
    getToday: () =>
        api.get('/habit-logs/today'),
    
    toggle: (habitId: number, completed: boolean) =>
        api.post(`/habits/${habitId}/toggle`, { completed }),
};

// ============================================
// JOURNAL
// ============================================
export const journalApi = {
    getAll: (page = 1) =>
        api.get(`/journal?page=${page}`),
    
    getOne: (id: number) =>
        api.get(`/journal/${id}`),
    
    create: (data: { title?: string; content: string; mood_level?: number }) =>
        api.post('/journal', data),
    
    update: (id: number, data: { title?: string; content?: string; mood_level?: number }) =>
        api.put(`/journal/${id}`, data),
    
    delete: (id: number) =>
        api.delete(`/journal/${id}`),
};

// ============================================
// STATISTIQUES
// ============================================
export const statisticsApi = {
    getMoodChart: (days = 30) =>
        api.get(`/statistics/mood-chart?days=${days}`),
    
    getHabitStats: () =>
        api.get('/statistics/habits'),
    
    getMonthlySummary: () =>
        api.get('/statistics/summary'),
};

export default api;