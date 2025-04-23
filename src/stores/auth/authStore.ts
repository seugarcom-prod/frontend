// src/stores/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Session } from 'next-auth';

interface AuthState {
    restaurantId: string | null;
    unitId: string | null;
    token: string | null;
    role: string | null;
    tokenExpiry: number | null; // Add expiry timestamp
    setRestaurantId: (id: string) => void;
    setUnitId: (id: string) => void;
    setToken: (token: string, expiry?: number) => void;
    setUserRole: (role: string) => void;
    updateFromSession: (session: Session | null) => void;
    clear: () => void;
    getHeaders: () => Record<string, string>;
    isTokenExpired: () => boolean;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            restaurantId: null,
            unitId: null,
            token: null,
            role: null,
            tokenExpiry: null,

            setRestaurantId: (id) => set({ restaurantId: id }),
            setUnitId: (id) => set({ unitId: id }),

            // Updated to store token expiry
            setToken: (token, expiry) => set({
                token,
                // Default expiry is 24 hours from now if not provided
                tokenExpiry: expiry || Date.now() + 24 * 60 * 60 * 1000
            }),

            setUserRole: (role) => set({ role }),

            updateFromSession: (session) => {
                if (session) {
                    // Extract expiry from JWT if possible
                    let expiry = null;
                    if (session.expires) {
                        expiry = new Date(session.expires).getTime();
                    }

                    set({
                        restaurantId: session.user?.restaurantId || null,
                        unitId: session.user?.unitId || null,
                        token: session.token || null,
                        role: session.user?.role || null,
                        tokenExpiry: expiry
                    });
                }
            },

            clear: () => set({
                restaurantId: null,
                unitId: null,
                token: null,
                role: null,
                tokenExpiry: null
            }),

            getHeaders: () => {
                const token = get().token;
                const headers: Record<string, string> = {
                    'Content-Type': 'application/json',
                };

                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }

                return headers;
            },

            // Add a method to check if token is expired
            isTokenExpired: () => {
                const { tokenExpiry } = get();
                if (!tokenExpiry) return true;

                // Return true if current time is past expiry time
                return Date.now() > tokenExpiry;
            }
        }),
        {
            name: 'restaurant-storage',
            partialize: (state) => ({
                restaurantId: state.restaurantId,
                unitId: state.unitId,
                token: state.token,
                role: state.role,
                tokenExpiry: state.tokenExpiry
            }),
        }
    )
);