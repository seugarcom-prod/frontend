'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { useEffect, ReactNode, useState } from 'react';
import { useAuthStore, useRestaurantStore } from '@/stores';
import { useRouter } from 'next/navigation';

interface SessionManagerProps {
    children: ReactNode;
}

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

// Este componente gerencia a sessão e sincroniza com os Zustand stores
export default function SessionManager({ children }: SessionManagerProps) {
    const { data: session, status } = useSession();
    const updateFromSession = useAuthStore(state => state.updateFromSession);
    const setRestaurantId = useRestaurantStore(state => state.setRestaurantId);

    // Sincroniza o estado dos stores com a sessão
    useEffect(() => {
        if (status === 'authenticated' && session) {
            // Atualiza o authStore
            updateFromSession(session);

            // Atualiza o restaurantStore se tiver restaurantId
            if (session.user?.restaurantId) {
                setRestaurantId(session.user.restaurantId);
            }
        }
    }, [session, status, updateFromSession, setRestaurantId]);

    return <>{children}</>;
}

// Hook para verificar autenticação e tipos de usuário
export function useAuthCheck() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const token = useAuthStore(state => state.token);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        setToken,
        setUserRole,
        setRestaurantId
    } = useAuthStore();

    // Verifica se está autenticado
    const isAuthenticated = status === 'authenticated' && (!!token || !!session?.token);

    // Verifica tipos específicos de usuário
    const isAdmin = isAuthenticated && session?.user?.role === 'ADMIN';
    const isManager = isAuthenticated && session?.user?.role === 'MANAGER';
    const isAttendant = isAuthenticated && session?.user?.role === 'ATTENDANT';
    const isClient = isAuthenticated && session?.user?.role === 'CLIENT';

    // Agrupamentos úteis
    const isAdminOrManager = isAdmin || isManager;
    const isStaff = isAdmin || isManager || isAttendant;

    const registerAdminWithRestaurant = async (payload: any) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${API_URL}/restaurant/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erro ao registrar restaurante');
            }

            // Armazenar dados no store
            if (data.token) {
                setToken(data.token);
                setUserRole('ADMIN');
            }

            if (data.restaurant?._id) {
                setRestaurantId(data.restaurant._id);
                useRestaurantStore.getState().setRestaurantId(data.restaurant._id);
            }

            // Integração com NextAuth
            await signIn('credentials', {
                email: payload.email,
                password: payload.password,
                redirect: false
            });

            return {
                success: true,
                restaurant: data.restaurant,
                token: data.token
            };
        } catch (error: any) {
            setError(error.message || 'Erro ao registrar restaurante');
            return {
                success: false,
                message: error.message || 'Erro ao registrar restaurante'
            };
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        setLoading(true);
        setError(null);

        try {
            // Chamar a API para autenticação
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Credenciais inválidas');
            }

            // Armazenar token no store
            setToken(data.token);

            // Armazenar o papel do usuário
            if (data.user && data.user.role) {
                setUserRole(data.user.role);

                // Armazenar restaurantId se for um usuário de restaurante
                if (['ADMIN', 'MANAGER', 'ATTENDANT'].includes(data.user.role) && data.user.restaurantId) {
                    setRestaurantId(data.user.restaurantId);
                }
            } else if (data.restaurant) {
                // Se for login de restaurante
                setUserRole('ADMIN');
                setRestaurantId(data.restaurant._id);
            } else {
                // Se for um cliente normal
                setUserRole('CLIENT');
            }

            // Integração com NextAuth
            await signIn('credentials', {
                email,
                password,
                redirect: false
            });

            return {
                success: true,
                user: data.user,
                restaurant: data.restaurant
            };
        } catch (error: any) {
            setError(error.message || 'Erro ao fazer login');
            return {
                success: false,
                message: error.message || 'Erro ao fazer login'
            };
        } finally {
            setLoading(false);
        }
    };

    // Função para autenticação como convidado
    const authenticateAsGuest = (tableId: string, restaurantId: string, restaurantName: string) => {
        // Criar token de convidado
        const guestToken = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;

        // Armazenar no store
        setToken(guestToken);

        // Armazenar informações no localStorage
        localStorage.setItem('guest_token', guestToken);
        localStorage.setItem(`table-${restaurantName}`, tableId);

        return {
            success: true,
            isGuest: true,
            tableId,
            restaurantId
        };
    };

    // Função para realizar logout
    const logout = async () => {
        try {
            // Fazer logout no NextAuth
            await signOut({ redirect: false });

            // Limpar states do Zustand
            useAuthStore.getState().clear();

            // Redirecionar para a página inicial
            router.push('/');

            return { success: true };
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
            return { success: false };
        }
    };

    return {
        isAuthenticated,
        isLoading: status === 'loading' || loading,
        isAdmin,
        isManager,
        isAttendant,
        isClient,
        isAdminOrManager,
        isStaff,
        role: session?.user?.role,
        session,
        error,

        // Funções de autenticação
        registerAdminWithRestaurant,
        authenticateAsGuest,
        login,
        logout
    };
}


// Hook para sincronizar a sessão com o store (usar em componentes de layout ou providers)
export function useSyncSession() {
    const { data: session, status } = useSession();
    const updateFromSession = useAuthStore(state => state.updateFromSession);

    // Apenas expõe os métodos para componentes que precisam sincronizar manualmente
    return {
        syncSession: () => {
            if (status === 'authenticated' && session) {
                updateFromSession(session);
            }
        },
        status,
        session
    };
}