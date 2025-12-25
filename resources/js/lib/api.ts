// resources/js/lib/api.ts
import { router } from '@inertiajs/react';

// ============================================
// AUTHENTIFICATION
// ============================================
export const authApi = {
    register: (data: { name: string; email: string; password: string; password_confirmation: string }) => {
        router.post('/register', data);
    },

    login: (data: { email: string; password: string }) => {
        router.post('/login', data);
    },

    logout: () => {
        router.post('/logout');
    },
};

// ============================================
// HUMEUR (MOODS)
// ============================================
export const moodApi = {
    store: (data: { mood_level: number; note?: string }) => {
        router.post('/moods', data, {
            preserveScroll: true,
            onSuccess: () => {
                // Handle success (e.g., show notification)
            },
        });
    },
};

// ============================================
// HABITUDES (HABITS)
// ============================================
export const habitApi = {
    create: (data: { name: string; category: string }) => {
        router.post('/habits', data, {
            preserveScroll: true,
        });
    },

    update: (id: number, data: { name?: string; category?: string; is_active?: boolean }) => {
        router.put(`/habits/${id}`, data, {
            preserveScroll: true,
        });
    },

    delete: (id: number) => {
        router.delete(`/habits/${id}`, {
            preserveScroll: true,
        });
    },

    toggle: (habitId: number, completed: boolean) => {
        router.post(`/habits/${habitId}/toggle`, { completed }, {
            preserveScroll: true,
        });
    },
};

// ============================================
// JOURNAL
// ============================================
export const journalApi = {
    create: (data: { title?: string; content: string; mood_level?: number }) => {
        router.post('/journal', data);
    },

    delete: (id: number) => {
        router.delete(`/journal/${id}`, {
            preserveScroll: true,
        });
    },
};

// Note: For GET requests, data is passed via Inertia props from the controller
// Example: In your controller:
// return Inertia::render('dashboard', [
//   'habits' => Habit::where('user_id', auth()->id())->get(),
//   'moods' => Mood::where('user_id', auth()->id())->latest()->take(7)->get(),
// ]);