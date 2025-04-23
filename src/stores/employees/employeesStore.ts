// stores/employeeStore.ts
import { create } from 'zustand';
import { IEmployee } from '@/services/employee';
import {
    getEmployeesByRestaurant,
    createEmployee,
    updateEmployee,
    deleteEmployee
} from '@/services/employee/index';
import { IRestaurantUnit } from '@/services/restaurant/types';

interface EmployeeState {
    employees: IEmployee[];
    units: IRestaurantUnit[]
    isLoading: boolean;
    error: string | null;
    fetchEmployees: (restaurantId: string, token: string) => Promise<void>;
    setUnits: (units: IRestaurantUnit[]) => void;
    addEmployee: (employeeData: Omit<IEmployee, '_id'>, restaurantId: string) => Promise<void>;
    updateEmployee: (employeeId: string, employeeData: Partial<IEmployee>) => Promise<void>;
    deleteEmployee: (employeeId: string) => Promise<void>;
}

export const useEmployeeStore = create<EmployeeState>((set, get) => ({
    employees: [],
    units: [],
    isLoading: false,
    error: null,

    fetchEmployees: async (restaurantId: string, token: string) => {
        set({ isLoading: true, error: null });
        try {
            const employees = await getEmployeesByRestaurant(restaurantId, token);
            set({ employees, isLoading: false });
        } catch (error: any) {
            set({
                error: error.message || 'Erro ao carregar funcionários',
                isLoading: false
            });
        }
    },

    setUnits: (units: IRestaurantUnit[]) => {
        set({ units });
    },

    addEmployee: async (employeeData: Omit<IEmployee, '_id'>, restaurantId: string) => {
        set({ isLoading: true, error: null });
        try {
            const token = localStorage.getItem('auth_token');
            if (!token) {
                throw new Error('Token de autenticação não encontrado');
            }

            const newEmployee = await createEmployee(employeeData, token, restaurantId); // Replace 'additionalArgument' with the actual third argument required
            set((state) => ({
                employees: [...state.employees, newEmployee],
                isLoading: false
            }));
        } catch (error: any) {
            set({
                error: error.message || 'Erro ao adicionar funcionário',
                isLoading: false
            });
            throw error;
        }
    },

    updateEmployee: async (employeeId: string, employeeData: Partial<IEmployee>) => {
        set({ isLoading: true, error: null });
        try {
            const updatedEmployee = await updateEmployee(employeeId, employeeData);
            set((state) => ({
                employees: state.employees.map(emp =>
                    emp._id === employeeId ? updatedEmployee : emp
                ),
                isLoading: false
            }));
        } catch (error: any) {
            set({
                error: error.message || 'Erro ao atualizar funcionário',
                isLoading: false
            });
        }
    },

    deleteEmployee: async (employeeId: string) => {
        set({ isLoading: true, error: null });
        try {
            await deleteEmployee(employeeId);
            set((state) => ({
                employees: state.employees.filter(emp => emp._id !== employeeId),
                isLoading: false
            }));
        } catch (error: any) {
            set({
                error: error.message || 'Erro ao excluir funcionário',
                isLoading: false
            });
        }
    }
}));