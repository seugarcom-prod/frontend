import { create, StateCreator } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';
import { useAuthStore } from '../auth';

interface RestaurantState {
    restaurantId: string | null;
    name: string | null;
    unitId: string | null;
    userRole: string | null;
    userName: string | null;
    fetchRestaurantName: (restaurantId: string) => Promise<void>;
    setName: (name: string) => void;
    setRestaurantId: (id: string) => void;
    setUnitId: (id: string) => void;
    setUserRole: (role: string) => void;
    setUserName: (name: string) => void;
    clear: () => void;
}

type RestaurantStorePersist = (
    config: StateCreator<RestaurantState>,
    options: PersistOptions<RestaurantState>
) => StateCreator<RestaurantState>;

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export const useRestaurantStore = create<RestaurantState>()(
    (persist as RestaurantStorePersist)(
        (set) => ({
            restaurantId: null,
            unitId: null,
            userRole: null,
            userName: null,
            name: null,
            setName: (name) => set((state) => ({ ...state, name })),

            fetchRestaurantName: async (restaurantId: string) => {
                try {
                    const response = await fetch(`${API_URL}/restaurant/${restaurantId}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    });

                    if (!response.ok) {
                        throw new Error('Failed to fetch restaurant name');
                    }

                    const data = await response.json();
                    set({ name: data.name });
                } catch (error) {
                    console.log('Erro ao buscar informações do restaurante.')
                }
            },

            setRestaurantId: (id) => set((state) => ({ ...state, restaurantId: id })),
            setUnitId: (id) => set((state) => ({ ...state, unitId: id })),
            setUserRole: (role) => set((state) => ({ ...state, userRole: role })),
            setUserName: (name) => set((state) => ({ ...state, userName: name })),
            clear: () => set({
                restaurantId: null,
                unitId: null,
                userRole: null,
                userName: null
            }),
        }),
        {
            name: 'restaurant-store',
            storage: {
                getItem: (name) => {
                    const item = localStorage.getItem(name);
                    return item ? JSON.parse(item) : null;
                },
                setItem: (name, value) => {
                    localStorage.setItem(name, JSON.stringify(value));
                },
                removeItem: (name) => {
                    localStorage.removeItem(name);
                },
            }
        }
    )
);