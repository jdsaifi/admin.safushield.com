import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types/user';
import api from '../lib/axios';

interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    accessToken: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            isAuthenticated: false,
            user: null,
            accessToken: null,
            login: async (email: string, password: string) => {
                try {
                    const response = await api.post('/v1/admin/login', {
                        email,
                        password,
                    });

                    if (response.data?.status !== 'success') {
                        throw new Error('Login failed');
                    }

                    const { user, accessToken } = response.data.data[0];
                    set({ isAuthenticated: true, user, accessToken });
                } catch (error) {
                    console.error('Login error:', error);
                    throw error;
                }
            },
            logout: () => {
                set({ isAuthenticated: false, user: null, accessToken: null });
            },
        }),
        {
            name: 'auth-storage',
        }
    )
);
