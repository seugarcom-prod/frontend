'use client';

import React, { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Skeleton } from '@/components/ui/skeleton'; // Componente de loading

type AllowedRole = 'ADMIN' | 'MANAGER' | 'ATTENDANT' | 'CLIENT';

interface RoleProtectedProps {
    allowedRoles: AllowedRole[];
    children: ReactNode;
    fallback?: ReactNode;
}

export default function RoleProtected({
    allowedRoles,
    children,
    fallback = <div>Acesso não autorizado</div>
}: RoleProtectedProps) {
    const { auth, isLoading } = useAuth();

    // Exibir spinner enquanto verifica autenticação
    if (isLoading) {
        return <div className="flex justify-center py-8"><Skeleton /></div>;
    }

    // Verificar se está autenticado
    if (!auth?.isAuthenticated) {
        return fallback;
    }

    // Verificar a role do usuário
    const userRole = auth.user?.role;
    const hasPermission = userRole && allowedRoles.includes(userRole as AllowedRole);

    if (!hasPermission) {
        return fallback;
    }

    // Se tem permissão, renderiza os children
    return <>{children}</>;
}

// Exemplo de uso:
//
// <RoleProtected allowedRoles={['ADMIN', 'MANAGER']}>
//   <AdminDashboard />
// </RoleProtected>