// stores/restaurantFormStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Interface para o objeto formData com todos os campos
interface FormData {
    // Dados do responsável (ADMIN)
    adminName: string;
    adminCpf: string;

    // Dados da loja (RESTAURANT)
    cnpjPart1: string;
    cnpjPart2: string;
    cnpjPart3: string;
    socialName: string;
    name: string;
    phone: string;
    specialty: string;

    // Endereço da loja
    zipCode: string;
    street: string;
    number: string;
    complement: string;

    // Horários de funcionamento
    schedules: Array<{
        days: string[];
        opens: string;
        closes: string;
    }>;

    // Credenciais de acesso
    email: string;
    password: string;
    confirmPassword: string;
}

interface RestaurantFormState {
    formData: FormData;
    updateFormData: (data: Partial<FormData>) => void;
    resetForm: () => void;
    setFormStep: (step: number) => void;
    currentStep: number;
}

// Valores iniciais para o formulário
const initialFormData: FormData = {
    adminName: '',
    adminCpf: '',
    cnpjPart1: '',
    cnpjPart2: '',
    cnpjPart3: '',
    socialName: '',
    name: '',
    phone: '',
    specialty: '',
    zipCode: '',
    street: '',
    number: '',
    complement: '',
    schedules: [
        {
            days: ['sex', 'sab', 'dom'],
            opens: '08:00',
            closes: '14:00'
        }
    ],
    email: '',
    password: '',
    confirmPassword: ''
};

export const useRestaurantFormStore = create<RestaurantFormState>()(
    persist(
        (set) => ({
            formData: { ...initialFormData },
            currentStep: 1,

            updateFormData: (data) =>
                set((state) => ({
                    formData: { ...state.formData, ...data }
                })),

            resetForm: () =>
                set({ formData: { ...initialFormData }, currentStep: 1 }),

            setFormStep: (step) =>
                set({ currentStep: step })
        }),
        {
            name: 'restaurant-form-storage',
        }
    )
);