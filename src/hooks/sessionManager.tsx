'use client';

import { useSession } from 'next-auth/react';
import { useEffect, ReactNode } from 'react';
import { useAuthStore, useRestaurantStore } from '@/stores';

interface SessionManagerProps {
    children: ReactNode;
}

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
    const token = useAuthStore(state => state.token);

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

    return {
        isAuthenticated,
        isLoading: status === 'loading',
        isAdmin,
        isManager,
        isAttendant,
        isClient,
        isAdminOrManager,
        isStaff,
        role: session?.user?.role,
        session
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