import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';

// Tipo para dados de autenticação
export interface AuthData {
    isAuthenticated: boolean;
    isGuest: boolean;
    user?: {
        _id?: string;
        firstName?: string;
        lastName?: string;
        email?: string;
        cpf?: string;
        isGuest: boolean;
        role?: string;
    };
    token?: string;
}

// Interface para dados de login
interface LoginCredentials {
    email: string;
    password: string;
}

// Interface para dados de login de convidado
interface GuestCredentials {
    email: string;
    cpf: string;
}

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

/**
 * Hook para salvar informações da mesa no localStorage
 */
export function useSaveTableInfo() {
    const saveTableInfo = (restaurantId: string, tableId: string) => {
        if (restaurantId && tableId) {
            localStorage.setItem(`table-${restaurantId}`, tableId);
            console.log(`Informações da mesa salvas: Restaurante ${restaurantId}, Mesa ${tableId}`);
            return true;
        }
        return false;
    };

    return saveTableInfo;
}

// Hook para login de usuário registrado
export function useLogin() {
    const router = useRouter();

    return useMutation({
        mutationFn: async (credentials: LoginCredentials) => {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Falha ao fazer login');
            }

            return await response.json();
        },
        onSuccess: (data) => {
            // Salvar token e informações do usuário
            localStorage.setItem('auth_token', data.token);
            localStorage.setItem('user_data', JSON.stringify(data.user));
            localStorage.removeItem('guest_token'); // Remover token de convidado se existir

            // Verificar se há informações de mesa/restaurante
            const storageKeys = Object.keys(localStorage);
            const tableKey = storageKeys.find(key => key.startsWith('table-'));

            if (tableKey) {
                const restaurantId = tableKey.replace('table-', '');
                router.push(`/restaurant/${restaurantId}/menu`);
            } else {
                router.push('/');
            }
        }
    });
}

// Hook para login de convidado
export function useGuestLogin() {
    const router = useRouter();

    return useMutation({
        mutationFn: async (credentials: GuestCredentials) => {
            // Em um caso real, você pode querer validar o convidado no backend
            // Aqui vamos simular um sucesso e criar um token de convidado

            // Simular um atraso de rede
            await new Promise(resolve => setTimeout(resolve, 500));

            // Criar dados fictícios de convidado
            return {
                isGuest: true,
                user: {
                    firstName: 'Convidado',
                    email: credentials.email,
                    cpf: credentials.cpf,
                    isGuest: true
                },
                token: `guest_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
            };
        },
        onSuccess: (data) => {
            // Salvar token de convidado
            localStorage.setItem('guest_token', data.token);
            localStorage.setItem('guest_data', JSON.stringify(data.user));

            // Verificar se há informações de mesa/restaurante
            const storageKeys = Object.keys(localStorage);
            const tableKey = storageKeys.find(key => key.startsWith('table-'));

            if (tableKey) {
                const restaurantId = tableKey.replace('table-', '');
                router.push(`/restaurant/${restaurantId}/menu`);
            } else {
                router.push('/');
            }
        }
    });
}

// Hook para verificar autenticação
export function useAuthCheck(redirectToLogin = false) {
    const [data, setData] = useState<AuthData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            setIsLoading(true);

            try {
                // Verificar autenticação de usuário normal
                const token = localStorage.getItem('auth_token');
                const userData = localStorage.getItem('user_data');

                // Verificar autenticação de convidado
                const guestToken = localStorage.getItem('guest_token');
                const guestData = localStorage.getItem('guest_data');

                // Verificar se há mesa/restaurante
                const storageKeys = Object.keys(localStorage);
                const tableKey = storageKeys.find(key => key.startsWith('table-'));

                if (token && userData) {
                    // Usuário autenticado
                    setData({
                        isAuthenticated: true,
                        isGuest: false,
                        user: { ...JSON.parse(userData), isGuest: false },
                        token
                    });
                } else if (guestToken && guestData) {
                    // Convidado autenticado
                    setData({
                        isAuthenticated: true,
                        isGuest: true,
                        user: { ...JSON.parse(guestData), isGuest: true },
                        token: guestToken
                    });
                } else if (tableKey && redirectToLogin) {
                    // Tem mesa mas não está autenticado, redirecionar para login
                    const restaurantId = tableKey.replace('table-', '');
                    const tableId = localStorage.getItem(tableKey);
                    router.push(`/login?restaurantId=${restaurantId}&tableId=${tableId}`);
                    setData({
                        isAuthenticated: false,
                        isGuest: false
                    });
                } else if (redirectToLogin) {
                    // Não está autenticado, redirecionar para login
                    router.push('/login');
                    setData({
                        isAuthenticated: false,
                        isGuest: false
                    });
                } else {
                    // Não está autenticado, mas não redireciona
                    setData({
                        isAuthenticated: false,
                        isGuest: false
                    });
                }
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [router, redirectToLogin]);

    return { data, isLoading };
}

// Hook para obter informações da mesa
export function useTableInfo(restaurantId: string) {
    const [tableNumber, setTableNumber] = useState<string | null>(null);

    useEffect(() => {
        if (restaurantId) {
            const storedTableNumber = localStorage.getItem(`table-${restaurantId}`);
            setTableNumber(storedTableNumber);
        }
    }, [restaurantId]);

    return { tableNumber };
}

// Hook para logout
export function useLogout() {
    const router = useRouter();

    const logout = () => {
        // Limpar tokens de autenticação
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        localStorage.removeItem('guest_token');
        localStorage.removeItem('guest_data');

        // Redirecionar para a página inicial
        router.push('/');
    };

    return { mutate: logout };
}