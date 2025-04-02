'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface AdminGuardProps {
    children: ReactNode;
    requiredRole?: 'ADMIN' | 'MANAGER' | 'ANY_ADMIN';
}

export default function AdminGuard({
    children,
    requiredRole = 'ADMIN'
}: AdminGuardProps) {
    const { isAuthenticated, user, loading } = useAuth();
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);
    const [redirectAttempted, setRedirectAttempted] = useState(false);

    // Verificação imediata de token ao montar o componente
    useEffect(() => {
        // Verificação rápida inicial - se há token, permitir renderização
        const token = localStorage.getItem('auth_token');
        if (token) {
            setAuthorized(true);
        }
    }, []);

    // Verificação completa após o carregamento
    useEffect(() => {
        // Se já está autorizado, não fazer verificações adicionais
        if (authorized) return;

        // Se já tentou redirecionar, não tentar novamente
        if (redirectAttempted) return;

        // Se ainda está carregando, aguardar
        if (loading) return;

        // Verificação rápida de token
        const token = localStorage.getItem('auth_token');

        // Sem token = redirecionar para login
        if (!token) {
            setRedirectAttempted(true);
            router.push('/login');
            return;
        }

        // Verificar role apenas se autenticado e tiver dados do usuário
        if (isAuthenticated && user) {
            const userRole = user.role;
            let hasRequiredRole = false;

            if (requiredRole === 'ANY_ADMIN') {
                hasRequiredRole = userRole === 'ADMIN' || userRole === 'MANAGER';
            } else {
                hasRequiredRole = userRole === requiredRole;
            }

            if (!hasRequiredRole) {
                setRedirectAttempted(true);
                router.push('/unauthorized');
                return;
            }
        }

        // Se passou pelas verificações ou tem token, autorizar
        setAuthorized(true);
    }, [loading, isAuthenticated, user, router, authorized, redirectAttempted, requiredRole]);

    // Timeout reduzido para 2 segundos
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (!authorized && !redirectAttempted) {
                const token = localStorage.getItem('auth_token');
                if (token) {
                    setAuthorized(true);
                } else {
                    setRedirectAttempted(true);
                    router.push('/login');
                }
            }
        }, 2000); // Reduzido para 2 segundos

        return () => clearTimeout(timeoutId);
    }, [authorized, redirectAttempted, router]);

    // Mostrar carregamento apenas se não estiver autorizado
    if (!authorized) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Se estiver autorizado, renderizar conteúdo
    return <>{children}</>;
}