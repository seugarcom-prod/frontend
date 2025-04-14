// hooks/useAuth.tsx
'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useRestaurantStore } from '@/stores';

interface RegisterRestaurantPayload {
    firstName: string;
    lastName: string;
    cpf: string;
    email: string;
    password: string;
    phone?: string;
    name: string; // Restaurant name
    socialName?: string;
    cnpj: string;
    specialty?: string;
    address: {
        zipCode: string;
        street: string;
        number: number;
        complement?: string;
    };
    businessHours?: Array<{
        days: string[];
        open: string;
        close: string;
    }>;
}

interface RegisterResponse {
    success: boolean;
    message: string;
    token?: string;
    user?: any;
    restaurant?: any;
    unit?: any;
}

export function useAuth() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const loading = status === 'loading';
    const [error, setError] = useState<string | null>(null);

    // Zustand store actions
    const {
        setRestaurantId,
        setUnitId,
        setUserRole,
        setUserName,
        clear
    } = useRestaurantStore();

    // Compatibilidade com o hook anterior
    const user = session?.user ? {
        id: session.user.id || session.user.id || '',
        name: session.user.name || '',
        email: session.user.email || '',
        role: session.user.role || ''
    } : null;

    const isAuthenticated = status === 'authenticated';
    const isAdmin = session?.user?.role === 'ADMIN' || session?.user?.role === 'MANAGER';

    // Verificar se o usuário tem um determinado papel
    const isRole = (role: string) => {
        return session?.user?.role === role;
    };

    // Login de usuário com suporte a Zustand
    const login = async (email: string, password: string) => {
        try {
            // Primeiro, fazer solicitação direta à API para obter o token e os dados do restaurante
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Falha na autenticação');
            }

            // Armazenar token no localStorage
            if (data.token) {
                localStorage.setItem('auth_token', data.token);

                // Armazenar dados do restaurante no Zustand
                if (data.restaurant?._id) {
                    setRestaurantId(data.restaurant._id);
                    setUserName(data.restaurant.name || data.restaurant.admin?.fullName || '');
                    setUserRole('ADMIN');
                }

                // Armazenar primeira unidade se disponível
                if (data.units && data.units.length > 0) {
                    setUnitId(data.units[0]._id);
                }
            }

            // Também autenticar com NextAuth para gerenciamento de sessão
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false
            });

            if (!result?.ok) {
                console.warn('Next-Auth warning:', result?.error);
                // Continuar mesmo se houver erro no NextAuth, pois já temos o token
            }

            // Se o usuário não for admin ou manager, fazer logout
            if (session?.user?.role !== 'ADMIN' && session?.user?.role !== 'MANAGER') {
                await signOut({ redirect: false });
                throw new Error('Acesso negado. Apenas administradores podem entrar.');
            }

            return { success: true, restaurant: data.restaurant, units: data.units };
        } catch (err: any) {
            setError(err.message || 'Erro ao fazer login');
            throw err;
        }
    };

    // Autenticar como convidado
    const authenticateAsGuest = (tableId: string, restaurantId: string, restaurantName: string, phone?: string) => {
        // Salvar informações da mesa no localStorage
        localStorage.setItem(`table-${restaurantName}`, tableId);

        // Criar identificador anônimo para convidado se não fornecer telefone
        const guestId = phone || `guest_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;

        // Armazenar restaurantId no Zustand store
        setRestaurantId(restaurantId);
        setUserRole('GUEST');

        // Iniciar sessão como convidado
        signIn('credentials', {
            id: guestId,
            restaurantId,
            tableId,
            isGuest: true,
            role: 'GUEST',
            redirect: false,
        });
    };

    // Logout com suporte a Zustand
    const logout = async () => {
        try {
            // Chamar API para invalidar token se necessário
            const token = localStorage.getItem('auth_token');
            if (token) {
                await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/logout`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
            }

            // Limpar token do localStorage
            localStorage.removeItem('auth_token');

            // Limpar store do Zustand
            clear();

            // Deslogar do NextAuth
            await signOut({ callbackUrl: '/' });

        } catch (err: any) {
            console.error('Erro ao fazer logout:', err);
        }
    };

    // Registrar admin com restaurante
    const registerAdminWithRestaurant = async (payload: RegisterRestaurantPayload): Promise<RegisterResponse> => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/register/restaurant`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erro ao registrar restaurante');
            }

            // Armazenar token no localStorage
            if (data.token) {
                localStorage.setItem('auth_token', data.token);
            }

            // Armazenar dados do restaurante no Zustand
            if (data.restaurant?._id) {
                setRestaurantId(data.restaurant._id);
                setUserName(data.restaurant.name);
                setUserRole('ADMIN');
            }

            // Armazenar dados da unidade no Zustand se disponíveis
            if (data.unit?._id) {
                setUnitId(data.unit._id);
            }

            // Também autenticar com NextAuth
            await signIn('credentials', {
                redirect: false,
                email: payload.email,
                password: payload.password,
            });

            return {
                success: true,
                message: 'Restaurante registrado com sucesso',
                token: data.token,
                user: data.user,
                restaurant: data.restaurant,
                unit: data.unit,
            };
        } catch (err: any) {
            setError(err.message || 'Erro ao registrar restaurante');
            return {
                success: false,
                message: err.message || 'Erro ao registrar restaurante',
            };
        }
    };

    return {
        user,
        session,
        status,
        loading,
        error,
        isAuthenticated,
        isAdmin,
        isRole,
        login,
        authenticateAsGuest,
        logout,
        registerAdminWithRestaurant
    };
}

// Hooks específicos para login com suporte a Zustand
export const userLogin = () => {
    const {
        setRestaurantId,
        setUnitId,
        setUserRole,
        setUserName
    } = useRestaurantStore();

    return useMutation({
        mutationFn: async ({ email, password }: { email: string; password: string }) => {
            try {
                // Primeiro, fazer solicitação direta à API
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/login/admin`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Falha na autenticação');
                }

                // Armazenar token e dados no Zustand
                if (data.token) {
                    localStorage.setItem('auth_token', data.token);

                    if (data.restaurant?._id) {
                        setRestaurantId(data.restaurant._id);
                        setUserName(data.restaurant.name);
                        setUserRole('ADMIN');
                    }

                    if (data.units && data.units.length > 0) {
                        setUnitId(data.units[0]._id);
                    }
                }

                // Autenticar com NextAuth
                const result = await signIn('credentials', {
                    email,
                    password,
                    redirect: false
                });

                if (!result?.ok) {
                    console.warn('Next-Auth warning:', result?.error);
                }

                return { ...result, data };
            } catch (err: any) {
                throw err;
            }
        }
    });
};

export const useGuestLogin = () => {
    const { setRestaurantId, setUserRole } = useRestaurantStore();

    return useMutation({
        mutationFn: async ({ phone }: { phone?: string }) => {
            // Verificar se há informações de mesa armazenadas
            const storageKeys = Object.keys(localStorage);
            const tableKey = storageKeys.find(key => key.startsWith('table-'));

            if (!tableKey) {
                console.warn('Informações da mesa não encontradas para login de convidado');
            }

            const tableId = localStorage.getItem(tableKey || '') || '';
            const restaurantName = tableKey?.replace('table-', '') || '';

            // Obter restaurantId do localStorage ou usar um padrão
            let restaurantId = localStorage.getItem('current_restaurant_id') || '';

            // Armazenar no Zustand
            if (restaurantId) {
                setRestaurantId(restaurantId);
                setUserRole('GUEST');
            }

            // Autenticar como convidado
            const result = await signIn('credentials', {
                id: phone || `guest_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
                phone,
                restaurantId,
                tableId,
                isGuest: true,
                role: 'GUEST',
                redirect: false
            });

            if (!result?.ok) {
                throw new Error(result?.error || 'Falha no login como convidado');
            }

            return result;
        }
    });
};