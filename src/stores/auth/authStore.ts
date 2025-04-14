// src/stores/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Session } from 'next-auth';

interface AuthState {
    restaurantId: string | null;
    unitId: string | null;
    token: string | null;
    role: string | null; // Adicionando o papel do usuário
    setRestaurantId: (id: string) => void;
    setUnitId: (id: string) => void;
    setToken: (token: string) => void;
    setUserRole: (role: string) => void; // Método para definir o papel do usuário
    updateFromSession: (session: Session | null) => void;
    clear: () => void;
    getHeaders: () => Record<string, string>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            restaurantId: null,
            unitId: null,
            token: null,
            role: null, // Inicializa o papel do usuário como null

            setRestaurantId: (id) => set({ restaurantId: id }),
            setUnitId: (id) => set({ unitId: id }),
            setToken: (token) => set({ token }),
            setUserRole: (role) => set({ role }), // Define o papel do usuário
            updateFromSession: (session) => {
                if (session) {
                    set({
                        restaurantId: session.user?.restaurantId || null,
                        unitId: session.user?.unitId || null,
                        token: session.token || null,
                        role: session.user?.role || null, // Atualiza o papel do usuário
                    });
                }
            },
            clear: () => set({ restaurantId: null, unitId: null, token: null, role: null }), // Limpa todos os estados
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
        }),
        {
            name: 'restaurant-storage',
            partialize: (state) => ({
                restaurantId: state.restaurantId,
                unitId: state.unitId,
                token: state.token,
                role: state.role, // Armazena o papel do usuário
            }),
        }
    )
);