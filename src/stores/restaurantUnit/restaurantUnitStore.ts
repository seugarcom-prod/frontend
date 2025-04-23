// src/stores/restaurantUnitStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useAuthStore } from '../index'; // Importe o authStore para acessar getHeaders

interface Address {
    zipCode: string;
    street: string;
    number: number;
    complement?: string;
}

interface RestaurantUnit {
    id: string;
    name: string;
    address: Address;
    cnpj: string;
    socialName: string;
    manager: string;
    phone: string;
    attendants: string[];
    restaurant: string;
    isActive: boolean;
}

interface RestaurantUnitState {
    units: RestaurantUnit[];
    currentUnitId: string | null; // Alterado de currentRestaurantId para currentUnitId
    fetchUnits: (restaurantId: string) => Promise<void>;
    fetchUnitByRestaurantId: (restaurantId: string) => Promise<string | null>;
    addUnit: (restaurantId: string, unitData: Omit<RestaurantUnit, 'id'>) => Promise<void>;
    updateUnit: (unitId: string, unitData: Partial<Omit<RestaurantUnit, 'id'>>) => Promise<void>;
    deleteUnit: (unitId: string, restaurantId: string) => Promise<void>;
    setCurrentUnitId: (unitId: string | null) => void; // Alterado nome da função
}

export const useRestaurantUnitStore = create<RestaurantUnitState>()(
    persist(
        (set) => ({
            units: [],
            currentUnitId: null,
            setCurrentUnitId: (id) => set({ currentUnitId: id }),

            fetchUnits: async (restaurantId: string) => {
                try {
                    const headers = useAuthStore.getState().getHeaders();
                    const response = await fetch(`/restaurant/${restaurantId}/units?includeMatrix=true`, {
                        headers,
                    });

                    if (!response.ok) {
                        throw new Error('Erro ao buscar unidades');
                    }

                    const units = await response.json();
                    set({ units });
                } catch (error) {
                    console.error('Erro ao buscar unidades:', error);
                }
            },

            fetchUnitByRestaurantId: async (restaurantId: string) => {
                try {
                    const headers = useAuthStore.getState().getHeaders();
                    const response = await fetch(`/restaurant/${restaurantId}/units`, {
                        headers,
                    });

                    if (!response.ok) {
                        throw new Error('Erro ao buscar unidades');
                    }

                    const units = await response.json();

                    if (Array.isArray(units) && units.length > 0) {
                        const unitId = units[0]._id;
                        set({ currentUnitId: unitId });
                        return unitId;
                    }

                    const restaurantResponse = await fetch(`/restaurant/${restaurantId}`, {
                        headers,
                    });

                    if (restaurantResponse.ok) {
                        const restaurant = await restaurantResponse.json();
                        if (restaurant && restaurantId) {
                            set({ currentUnitId: restaurantId });
                            return restaurantId;
                        }
                    }

                    return null;
                } catch (error) {
                    console.error('Erro ao buscar unidade:', error);
                    return null;
                }
            },

            addUnit: async (restaurantId: string, unitData: Omit<RestaurantUnit, 'id'>) => {
                try {
                    const headers = useAuthStore.getState().getHeaders();
                    const response = await fetch(`/restaurant/${restaurantId}/units`, {
                        method: 'POST',
                        headers: {
                            ...headers,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(unitData),
                    });

                    if (!response.ok) {
                        throw new Error('Erro ao adicionar unidade');
                    }

                    const newUnit = await response.json();
                    set((state) => ({ units: [...state.units, newUnit] }));
                } catch (error) {
                    console.error('Erro ao adicionar unidade:', error);
                }
            },

            updateUnit: async (unitId: string, unitData: Partial<Omit<RestaurantUnit, 'id'>>) => {
                try {
                    const headers = useAuthStore.getState().getHeaders();
                    const response = await fetch(`/unit/${unitId}`, {
                        method: 'PUT',
                        headers: {
                            ...headers,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(unitData),
                    });

                    if (!response.ok) {
                        throw new Error('Erro ao atualizar unidade');
                    }

                    const updatedUnit = await response.json();
                    set((state) => ({
                        units: state.units.map((unit) =>
                            unit.id === unitId ? { ...unit, ...updatedUnit } : unit
                        ),
                    }));
                } catch (error) {
                    console.error('Erro ao atualizar unidade:', error);
                }
            },

            deleteUnit: async (unitId: string, restaurantId: string) => {
                try {
                    const headers = useAuthStore.getState().getHeaders();
                    const response = await fetch(`/restaurant/${restaurantId}/units/${unitId}`, {
                        method: 'DELETE',
                        headers,
                    });

                    if (!response.ok) {
                        throw new Error('Erro ao deletar unidade');
                    }

                    set((state) => ({
                        units: state.units.filter((unit) => unit.id !== unitId),
                    }));
                } catch (error) {
                    console.error('Erro ao deletar unidade:', error);
                }
            },

            // ... (manter o resto das funções como estão)
        }),
        {
            name: 'restaurant-unit-storage',
        }
    )
);