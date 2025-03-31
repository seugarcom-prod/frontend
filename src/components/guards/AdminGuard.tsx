'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface AdminGuardProps {
    children: ReactNode;
    requiredRole?: 'ADMIN' | 'MANAGER' | 'ANY_ADMIN';
}

/**
 * Componente AdminGuard
 * 
 * Este componente protege rotas administrativas verificando se o usuário:
 * 1. Está autenticado
 * 2. Possui a role adequada (ADMIN, MANAGER ou qualquer uma das duas)
 * 
 * Caso o usuário não atenda aos requisitos, ele será redirecionado para a página de login.
 */
export default function AdminGuard({
    children,
    requiredRole = 'ANY_ADMIN'
}: AdminGuardProps) {
    const { isAuthenticated, user, loading } = useAuth();
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        // Verificar se está carregando
        if (loading) {
            return;
        }

        // Verificar se está autenticado
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        // Obter a role do usuário
        const userRole = user?.role;

        // Verificar se tem a role adequada
        let hasRequiredRole = false;

        if (requiredRole === 'ADMIN') {
            hasRequiredRole = userRole === 'ADMIN';
        } else if (requiredRole === 'MANAGER') {
            hasRequiredRole = userRole === 'MANAGER';
        } else if (requiredRole === 'ANY_ADMIN') {
            hasRequiredRole = userRole === 'ADMIN' || userRole === 'MANAGER';
        }

        if (!hasRequiredRole) {
            // Redirecionar para página de não autorizado
            router.push('/unauthorized');
            return;
        }

        // Se chegou até aqui, está autorizado
        setAuthorized(true);

    }, [isAuthenticated, loading, requiredRole, router]);

    // Mostrar indicador de carregamento enquanto verifica a autenticação
    if (loading || !authorized) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Se estiver autorizado, renderizar o conteúdo
    return <>{children}</>;
}