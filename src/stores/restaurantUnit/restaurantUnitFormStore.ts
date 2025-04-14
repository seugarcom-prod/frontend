// stores/restaurantUnitFormStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Interface para o objeto unitData com todos os campos
interface UnitData {
    cnpjPart1: string;
    cnpjPart2: string;
    cnpjPart3: string;
    cnpj: string; // Novo campo para o CNPJ completo
    socialName: string;
    name: string;
    phone: string;
    specialty: string;
    zipCode: string;
    street: string;
    number: string;
    complement: string;
    useMatrixCNPJ: boolean;
    useMatrixSchedule: boolean;
    managers: {
        id: string;
        name: string;
    }[] // Alterado para incluir o ID do gerente
    schedules: Array<{
        days: string[];
        opens: string;
        closes: string;
    }>;
}

interface RestaurantUnitFormState {
    unitData: UnitData;
    updateUnitData: (data: Partial<UnitData>) => void;
    resetUnitData: () => void;
    setUnitStep: (step: number) => void;
    currentStep: number;
}

// Valores iniciais para o formulário da unidade
const initialUnitData: UnitData = {
    cnpjPart1: '',
    cnpjPart2: '',
    cnpjPart3: '',
    cnpj: '', // Inicialmente vazio
    socialName: '',
    name: '',
    phone: '',
    specialty: '',
    zipCode: '',
    street: '',
    number: '',
    complement: '',
    useMatrixCNPJ: false,
    useMatrixSchedule: false,
    managers: [{
        id: '',
        name: ''
    }],
    schedules: []
};

export const useRestaurantUnitFormStore = create<RestaurantUnitFormState>()(
    persist(
        (set) => ({
            unitData: { ...initialUnitData },
            currentStep: 1,

            updateUnitData: (data) =>
                set((state) => {
                    const updatedData = { ...state.unitData, ...data };
                    // Atualiza o CNPJ completo sempre que as partes forem alteradas
                    updatedData.cnpj = `${updatedData.cnpjPart1}/${updatedData.cnpjPart2}-${updatedData.cnpjPart3}`;
                    return { unitData: updatedData };
                }),

            resetUnitData: () =>
                set({ unitData: { ...initialUnitData }, currentStep: 1 }),

            setUnitStep: (step) =>
                set({ currentStep: step })
        }),
        {
            name: 'restaurant-unit-form-storage',
        }
    )
);